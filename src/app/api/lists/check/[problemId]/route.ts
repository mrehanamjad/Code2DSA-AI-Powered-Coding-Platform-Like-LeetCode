import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import ListProblem from "@/models/listProblem.model";
import ProblemList from "@/models/problemList.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const session = await getServerSession(AuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await params;
    if (!problemId) {
      return NextResponse.json({ error: "Problem ID is required" }, { status: 400 });
    }

    await connectionToDatabase();

    // 1. Find all lists owned by the user
    const userLists = await ProblemList.find({ owner: session.user.id }).select('_id').lean();
    const listIds = userLists.map((list: { _id: unknown }) => list._id);

    // 2. Find which of these lists contain the given problemId
    const inclusions = await ListProblem.find({
      listId: { $in: listIds },
      problemId: problemId,
    }).select('listId').lean();

    // 3. Return an array of just the list IDs stringified
    const includedListIds = inclusions.map((inc: { listId: unknown }) => String(inc.listId));

    return NextResponse.json({ success: true, listIds: includedListIds }, { status: 200 });
  } catch (error) {
    console.error("Error checking list inclusions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
