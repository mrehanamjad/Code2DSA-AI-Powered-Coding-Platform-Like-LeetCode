import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Submission, { SubmissionI } from "@/models/submission.model";
import mongoose from "mongoose";
import UserStatistic, { UserStatisticI } from "@/models/userStatistic.model";
import Problem, { ProblemI } from "@/models/problem.model";

import {
  calculateScore,
  calculateXP,
  calculateLevel,
  updateStreak,
  isStreakBroken,
  isStreakContinued,
} from "@/lib/stats";
import { updateUserStatistics } from "./updateUserStats";

/**
 * @method POST
 * @desc Create a new submission record.
 * @note Usually called after the code execution engine returns a result.
 */

// export async function POST(req: NextRequest) {
//   try {
//     // --- 1. Authenticate user ---
//     const session = await getServerSession(AuthOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // --- 2. Connect to DB ---
//     await connectionToDatabase();

//     // --- 3. Parse and validate body ---
//     const body = await req.json();

//     const {
//       problemId,
//       code,
//       language,
//       totalTestCases = 0,
//       passedTestCases = 0,
//       status,
//       lastFailedTestCase = null,
//       note = "",
//     } = body;

//     if (!problemId || !code || !language || !status) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // --- 4. Validate ObjectId fields ---
//     if (!mongoose.Types.ObjectId.isValid(problemId)) {
//       return NextResponse.json(
//         { error: "Invalid problemId format" },
//         { status: 400 }
//       );
//     }

//     // --- 5. Prevent duplicate submissions ---
//     // Duplicate = same userId, problemId, code, language, status
//     const existing = await Submission.findOne({
//       userId: session.user.id,
//       problemId,
//       code,
//       language,
//       status,
//     }).lean();

//     if (existing ) {
//       return NextResponse.json(
//          existing,
//         { status: 409 } // Conflict
//       );
//     }

//     // --- 6. Create submission ---
//     const newSubmission: SubmissionI = await Submission.create({
//       userId: new mongoose.Types.ObjectId(session.user.id),
//       problemId: new mongoose.Types.ObjectId(problemId),
//       code,
//       language,
//       totalTestCases,
//       passedTestCases,
//       status,
//       lastFailedTestCase,
//       note,
//     });

//     return NextResponse.json(newSubmission, { status: 201 });

//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Internal Server Error";
//     console.error("POST /api/submissions Error:", error);

//     return NextResponse.json(
//       { error: "Failed to save submission", details: message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    // 1) AUTHENTICATION
    const session = await getServerSession(AuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2) DB CONNECT
    await connectionToDatabase();

    // 3) BODY PARSING + BASIC VALIDATION
    const body = await req.json();
    const {
      problemId,
      code,
      language,
      totalTestCases = 0,
      passedTestCases = 0,
      status,
      lastFailedTestCase = null,
      note = "",
    } = body;

    if (!problemId || !code || !language || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return NextResponse.json(
        { error: "Invalid problemId format" },
        { status: 400 }
      );
    }

    // 4) PREVENT EXACT DUPLICATES
    const duplicate = await Submission.findOne({
      userId,
      problemId,
      code,
      language,
      status,
    }).lean();

    if (duplicate) {
      return NextResponse.json(duplicate, { status: 200 });
    }

    // 6) CREATE SUBMISSION
    const newSubmission: SubmissionI = await Submission.create({
      userId,
      problemId,
      code,
      language,
      totalTestCases,
      passedTestCases,
      status,
      lastFailedTestCase,
      note,
    });

    // 7). TRIGGER USER STATS UPDATE (The new part) ---
    // We run this asynchronously. In a high-scale app, this would go to a message queue (Redis/BullMQ).
    // For now, we await it to ensure consistency, but wrap in try/catch so it doesn't block the UI response if it errors.
    try {
      await updateUserStatistics({
        userId: session.user.id,
        problemId: problemId,
        status: status,
        language: language
      });
    } catch (statsError) {
      // Log this silently or to a monitoring service (Sentry). 
      // Do NOT fail the request just because stats failed calculation.
      console.error("Failed to update user stats:", statsError);
    }

    // 8) RETURN SUCCESS
    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/submissions Error:", error);
    return NextResponse.json(
      { error: "Failed to save submission", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @desc Fetch submissions with pagination.
 * @filters problemId (optional) - to see history for a specific problem
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const userId = session.user.id;

    // Build Query
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (problemId) {
      query.problemId = new mongoose.Types.ObjectId(problemId);
    }

    // Efficient Querying:
    // 1. lean(): Return plain JS objects instead of Mongoose Documents (faster)
    // 2. select(): Exclude heavy fields like 'lastFailedTestCase' for the list view if not needed
    // 3. sort(): Newest first
    const [submissions, total] = await Promise.all([
      Submission.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("problemId", "title difficulty problemId")
        .lean(),
      Submission.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        data: submissions,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/submissions Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions", details: error.message },
      { status: 500 }
    );
  }
}
