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
 * @method GET
 * @desc Fetch a specific problem list and its paginated problems
 */
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);
    await connectionToDatabase();

    const { listId } = await params;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return NextResponse.json({ error: "Invalid list ID" }, { status: 400 });
    }

    const list = await ProblemList.findById(listId);

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Access control: allow if list is public or if the user is the owner
    const isOwner = session?.user?.id === list.owner?.toString();
    if (!list.isPublic && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Pagination parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Aggregation pipeline to fetch ordered problems for this list
    const aggregateQuery = ListProblem.aggregate([
      { $match: { listId: new mongoose.Types.ObjectId(listId) } },
      {
        $lookup: {
          from: "problems",
          localField: "problemId",
          foreignField: "_id",
          as: "problemDetails",
        },
      },
      { $unwind: "$problemDetails" },
      { $sort: { order: 1 } },
      {
        $project: {
          _id: 1,
          order: 1,
          problemId: 1,
          "problemDetails.problemId": 1,
          "problemDetails.title": 1,
          "problemDetails.difficulty": 1,
          "problemDetails.topics": 1,
          "problemDetails.status": 1,
          "problemDetails._id": 1,
        },
      },
    ]);

    // Apply pagination
    const options = {
      page,
      limit,
    };

    // @ts-expect-error - mongoose-aggregate-paginate-v2 typing issues
    const paginatedProblems = await ListProblem.aggregatePaginate(
      aggregateQuery,
      options
    );

    console.log("**** Fetched list ****", list);
    console.log("**** Fetched problems ****", paginatedProblems);

    return NextResponse.json(
      {
        list,
        problems: paginatedProblems,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch list", details: message },
      { status: 500 }
    );
  }
}

/**
 * @method PATCH
 * @desc Update a specific problem list's details
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
    const { title, description, isPublic } = body;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return NextResponse.json({ error: "Invalid list ID" }, { status: 400 });
    }

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

    // Update fields if provided
    if (title !== undefined) list.title = title.trim();
    if (description !== undefined) list.description = description.trim();
    if (isPublic !== undefined) list.isPublic = Boolean(isPublic);

    await list.save();

    return NextResponse.json(
      { message: "List updated successfully", list },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update list", details: message },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @desc Delete a problem list and all its associated problems
 */
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const { listId } = await params;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return NextResponse.json({ error: "Invalid list ID" }, { status: 400 });
    }

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

    // 1. Delete all associated ListProblem records
    await ListProblem.deleteMany({ listId: list._id });

    // 2. Delete the ProblemList itself
    await ProblemList.findByIdAndDelete(list._id);

    return NextResponse.json(
      { message: "List deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete list", details: message },
      { status: 500 }
    );
  }
}
