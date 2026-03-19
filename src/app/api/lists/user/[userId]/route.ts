import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import ProblemList from "@/models/problemList.model";
import mongoose from "mongoose";

type Props = {
    params: Promise<{
        userId: string;
    }>;
};

/**
 * @method GET
 * @desc Fetch all lists for a specific user
 */
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);

    await connectionToDatabase();

    const { userId } = await params;

    const searchParams = req.nextUrl.searchParams;
    const problemId = searchParams.get("problemId");

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const matchCondition =
      session?.user?.id === userId
        ? { owner: new mongoose.Types.ObjectId(userId) }
        : { owner: new mongoose.Types.ObjectId(userId), isPublic: true };

    // ---- If no problemId → simple query ----
    if (!problemId) {
      const lists = await ProblemList.find(matchCondition)
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ lists }, { status: 200 });
    }

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    // ---- Aggregation to check if problem exists in list ----
    const lists = await ProblemList.aggregate([
      { $match: matchCondition },

      {
        $lookup: {
          from: "listproblems",
          let: { listId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$listId", "$$listId"] },
                    {
                      $eq: [
                        "$problemId",
                        new mongoose.Types.ObjectId(problemId),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "problemMatch",
        },
      },

      {
        $addFields: {
          containsProblem: { $gt: [{ $size: "$problemMatch" }, 0] },
        },
      },

      {
        $project: {
          problemMatch: 0,
        },
      },

      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json({ lists }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch lists", details: message },
      { status: 500 }
    );
  }
}