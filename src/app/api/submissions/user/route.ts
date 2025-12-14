import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Submission from "@/models/submission.model";
import mongoose, { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectionToDatabase();

    // 1. Get Params
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const difficulty = searchParams.get("difficulty"); // "Easy", "Medium", "Hard"

    // 2. Base Pipeline
    const pipeline: PipelineStage[] = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$problemId",
          lastSubmittedAt: { $first: "$createdAt" },
          lastStatus: { $first: "$status" },
          totalSubmissions: { $sum: 1 },
          isSolved: {
            $max: { $cond: [{ $eq: ["$status", "accepted"] }, true, false] },
          },
        },
      },
      {
        $lookup: {
          from: "problems",
          localField: "_id",
          foreignField: "_id",
          as: "problemDetails",
        },
      },
      { $unwind: "$problemDetails" },
    ];

    // 3. Apply Difficulty Filter (Server-Side)
    // We do this AFTER the lookup because 'difficulty' lives in the problem collection
    if (difficulty && difficulty !== "All") {
      pipeline.push({
        $match: {
          "problemDetails.difficulty": difficulty,
        },
      });
    }

    // 4. Final Projection & Sort
    pipeline.push(
      { $sort: { lastSubmittedAt: -1 } },
      {
        $project: {
          _id: 0,
          problemId: "$problemDetails._id",
          title: "$problemDetails.title",
          difficulty: "$problemDetails.difficulty",
          topics: "$problemDetails.topics", // or tags
          frontendProblemId: "$problemDetails.problemId",
          lastSubmittedAt: 1,
          lastStatus: 1,
          totalSubmissions: 1,
          isSolved: 1,
        },
      }
    );

    // 5. Execute Aggregation with Pagination
    const myAggregate = Submission.aggregate(pipeline);

    // @ts-expect-error - to ignore error: 'Submission.aggregatePaginate' is of type 'unknown'.ts(18046)
    const results = await Submission.aggregatePaginate(myAggregate, {
      page,
      limit,
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("GET/user API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}
