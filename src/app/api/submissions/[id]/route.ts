import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Submission, { SubmissionI } from "@/models/submission.model";
import mongoose from "mongoose";
import { SubmissionResponseT } from "@/lib/apiClient/types";

/**
 * @method GET
 * @desc Fetch a single submission by ID.
 * @security Ensures users can only view their own submissions.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(AuthOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissionId = await params.id;
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await connectionToDatabase();

    const submission = await Submission.findById(submissionId)
        .populate("problemId", "title problemId difficulty function") 
        .lean() as SubmissionResponseT | null;

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }


    if (submission.userId.toString() !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(submission, { status: 200 });

  } catch (error: any) {
    console.error("GET /api/submissions/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission details", details: error.message },
      { status: 500 }
    );
  }
}

