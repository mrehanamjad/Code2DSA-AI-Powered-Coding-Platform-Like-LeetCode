import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Submission, { SubmissionI } from "@/models/submission.model";
import mongoose from "mongoose";
import { updateUserStatistics } from "./updateUserStats";
import { recordDailyActivity } from "./recordActivity";

/**
 * @method POST
 * @desc Create a new submission record.
 * @note Usually called after the code execution engine returns a result.
 */

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
      error,
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
      error,
      lastFailedTestCase,
      note,
    });

    // 7). TRIGGER USER STATS UPDATE (The new part) ---
    // We run this asynchronously. In a high-scale app, this would go to a message queue (Redis/BullMQ).
    // For now, we await it to ensure consistency, but wrap in try/catch so it doesn't block the UI response if it errors.
    try {
      await Promise.all([
        // Your existing stats update
        updateUserStatistics({
          userId: session.user.id,
          problemId,
          status,
          language,
        }),

        // NEW: Record Daily Activity for the Graph
        recordDailyActivity({
          userId: session.user.id,
          status,
        }),
      ]);
      
    } catch (error) {
      console.error("Stats/Activity update failed", error);
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
