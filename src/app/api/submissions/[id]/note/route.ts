import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Submission, { SubmissionI } from "@/models/submission.model";
import mongoose from "mongoose";

/**
 * PATCH /api/submission/[id]/note
 * Update the note of a submission
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    // --- 1. Authenticate user ---
    const session = await getServerSession(AuthOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // --- 2. Parse request body ---
    const body: { note: string } = await req.json();
    const note = body?.note;
    if (typeof note !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'note' field" },
        { status: 400 }
      );
    }

    // --- 3. Validate submission ID ---
    const {id} = await params;
    const submissionId = id;
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID format" },
        { status: 400 }
      );
    }

    // --- 4. Connect to DB ---
    await connectionToDatabase();

    // --- 5. Fetch submission ---
    const submission = await Submission.findById(submissionId) as SubmissionI | null;
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // --- 6. Authorization check ---
    if (submission.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this submission" },
        { status: 403 }
      );
    }

    // --- 7. Update note only if changed ---
    if (submission.note !== note) {
      submission.note = note;
      await submission.save();
    }

    // --- 8. Return updated submission ---
    return NextResponse.json(submission, { status: 200 });

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    console.error("PATCH /api/submission/[id]/note Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}
