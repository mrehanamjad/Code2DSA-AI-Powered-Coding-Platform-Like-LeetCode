import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Submission from "@/models/submission.model";
import mongoose from "mongoose";

/**
 * @method GET
 * @desc Get all submissions for a specific problem for the authenticated user.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    // --- 1. Authenticate User ---
    const session = await getServerSession(AuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await params;

    // --- 2. Validate ObjectId ---
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return NextResponse.json(
        { error: "Invalid problemId format" },
        { status: 400 }
      );
    }

    // --- 3. DB Connection ---
    await connectionToDatabase();

    // --- 4. Fetch submissions ---
    const submissions = await Submission.find({
      userId: session.user.id,
      problemId,
    })
      .select("problemId status language note createdAt updatedAt")
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json(submissions, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Error";
    console.error("GET /api/submission/[problemId] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch submissions", details: message },
      { status: 500 }
    );
  }
}
