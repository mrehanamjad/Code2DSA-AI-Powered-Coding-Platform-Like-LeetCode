import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Submission, { SubmissionI } from "@/models/submission.model";
import mongoose from "mongoose";
import { PopulatedProblem } from "@/lib/apiClient/types";
import Problem from "@/models/problem.model"; // Ensure this is imported

/**
 * @method GET
 * @desc Fetch a single submission by ID.
 * @security Ensures users can only view their own submissions.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession(AuthOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Await params before using properties
    const { id: submissionId } = await params;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await connectionToDatabase();

    // 3. Fix MissingSchemaError by explicitly passing the Problem model to populate
    const submission = await Submission.findById(submissionId)
        .populate<{ problemId: PopulatedProblem }>({
            path: "problemId",
            model: Problem, // Explicitly use the imported model
            select: "title problemId difficulty function"
        }) 
        .lean() as SubmissionI | null;

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