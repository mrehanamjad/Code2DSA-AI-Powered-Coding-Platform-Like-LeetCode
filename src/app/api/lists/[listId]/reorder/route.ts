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
  }>;
};

/**
 * @method PATCH
 * @desc Reorder problems within a specific list
 */
export async function PATCH(req: NextRequest, { params }: Props) {
  try {


    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const { listId } = await params;
    const body = await req.json();
    const { updates } = body; // Expects an array of { problemId: string, order: number }

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return NextResponse.json({ error: "Invalid list ID" }, { status: 400 });
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: "Updates must be a non-empty array" },
        { status: 400 }
      );
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

    // 2. Perform bulk write operation safely
    const bulkOperations = updates.map((update: { problemId: string; order: number }) => ({
      updateOne: {
        filter: {
          listId: list._id,
          problemId: new mongoose.Types.ObjectId(update.problemId),
        },
        update: {
          $set: { order: update.order },
        },
      },
    }));

    const result = await ListProblem.bulkWrite(bulkOperations);

    return NextResponse.json(
      { message: "Problems reordered successfully", result },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to reorder problems", details: message },
      { status: 500 }
    );
  }
}
