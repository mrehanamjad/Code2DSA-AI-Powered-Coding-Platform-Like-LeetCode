import { NextRequest, NextResponse } from "next/server";

import { connectionToDatabase } from "@/lib/db";
import Submission from "@/models/submission.model";
import mongoose from "mongoose";

export async function GET(req: NextRequest,
      { params }: { params: Promise<{ userId: string }> }
) {
  try {

     const { userId } = await  params;
    await connectionToDatabase();

    const rawSubmissions = await Submission.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50) // Fetching 50 ensures we likely find 10 distinct consecutive groups
      .populate("problemId", "title problemId") // Get Title and Frontend ID
      .select("status createdAt problemId") // Only fetch needed fields
      .lean();

    // 3. Filter Consecutive Duplicates
    const distinctSubmissions: any[] = [];
    let lastProblemId: string | null = null;

    for (const sub of rawSubmissions) {
      // Safety check: skip if problem was deleted from DB (problemId would be null)
      if (!sub.problemId) continue;

      // @ts-ignore - ._id exists on populated object in lean()
      const currentProblemId = sub.problemId._id.toString();

      // IF this submission is for a DIFFERENT problem than the previous one, keep it.
      // (Since we are iterating newest->oldest, this keeps the NEWEST of a group)
      if (currentProblemId !== lastProblemId) {
        distinctSubmissions.push({
          _id: sub._id,
          title: (sub.problemId as any).title,
          frontendProblemId: (sub.problemId as any).problemId,
          status: sub.status,
          createdAt: sub.createdAt,
        });

        // Update tracker
        lastProblemId = currentProblemId;
      }

      // Stop once we have 7 items
      if (distinctSubmissions.length >= 7) break;
    }

    // 4. Return result
    return NextResponse.json(distinctSubmissions, { status: 200 });

  } catch (error: any) {
    console.error("Recent Submissions Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}