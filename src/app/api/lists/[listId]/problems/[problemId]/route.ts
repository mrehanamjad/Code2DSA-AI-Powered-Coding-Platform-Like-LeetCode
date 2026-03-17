import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import ProblemList from "@/models/problemList.model";
import ListProblem from "@/models/listProblem.model";
import mongoose from "mongoose";

type Props = {
  params: Promise<{
    listId: string;
    problemId: string;
  }>;
};

/**
 * @method DELETE
 * @desc Remove a specific problem from a specific problem list
 */
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const { listId, problemId } = await params;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return NextResponse.json({ error: "Invalid list ID" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    // 1. Verify list exists and user owns it
    const list = await ProblemList.findById(listId);

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (list.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this list" },
        { status: 403 }
      );
    }

    // 2. Delete the associated ListProblem record
    const deletedEntry = await ListProblem.findOneAndDelete({
      listId: list._id,
      problemId: new mongoose.Types.ObjectId(problemId),
    });

    if (!deletedEntry) {
      return NextResponse.json(
        { error: "Problem is not in this list" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Problem removed from list successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to remove problem from list", details: message },
      { status: 500 }
    );
  }
}
