import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import ProblemList from "@/models/problemList.model";
import ListProblem from "@/models/listProblem.model";
import Problem from "@/models/problem.model";
import mongoose from "mongoose";

type Props = {
  params: Promise<{
    listId: string;
  }>;
};

/**
 * @method POST
 * @desc Add a problem to a specific problem list
 */
export async function POST(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const { listId } = await params;
    const body = await req.json();
    const { problemId } = body;

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

    // 2. Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // 3. Prevent duplicates
    const existingEntry = await ListProblem.findOne({
      listId: list._id,
      problemId: problem._id,
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Problem is already in the list" },
        { status: 409 }
      );
    }

    // 4. Calculate next order value
    // Find the current max order in this specific list
    const maxOrderProblem = await ListProblem.findOne({ listId: list._id })
      .sort({ order: -1 })
      .select("order")
      .lean();

    const nextOrder = maxOrderProblem ? maxOrderProblem.order + 1 : 0;

    // 5. Add problem to list
    const newEntry = await ListProblem.create({
      listId: list._id,
      problemId: problem._id,
      order: nextOrder,
    });

    return NextResponse.json(
      { message: "Problem added to list successfully", entry: newEntry },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    
    // Check for MongoDB duplication error (11000) just in case
    // Handle race conditions where dual-inserts might happen at exactly the same ms
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: "Problem is already in the list" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add problem to list", details: message },
      { status: 500 }
    );
  }
}
