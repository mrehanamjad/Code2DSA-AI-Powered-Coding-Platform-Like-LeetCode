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
      executionTime = null,
      memoryUsed = null,
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
      executionTime,
      memoryUsed,
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
  } catch (error) {
    console.error("POST /api/submissions Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to save submission", details: message },
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

    const userId = session.user.id;

    const matchStage: {
      userId: mongoose.Types.ObjectId;
      problemId?: mongoose.Types.ObjectId;
    } = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (problemId) {
      matchStage.problemId = new mongoose.Types.ObjectId(problemId);
    }

    const aggregate = Submission.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "problems",
          localField: "problemId",
          foreignField: "_id",
          as: "problem",
        },
      },
      { $unwind: "$problem" },
      {
        $project: {
          code: 0,
          lastFailedTestCase: 0,
          "problem.description": 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const options = { page, limit };

    // @ts-expect-error - aggregatePaginate is added by the plugin but not in the types
    const result = await Submission.aggregatePaginate(aggregate, options);

    return NextResponse.json(
      {
        data: result.docs,
        meta: {
          total: result.totalDocs,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/submissions Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch submissions", details: message },
      { status: 500 }
    );
  }
}

