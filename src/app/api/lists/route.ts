import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import ProblemList from "@/models/problemList.model";

/**
 * @method POST
 * @desc Create a new problem list
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const body = await req.json();
    const { title, description, isPublic } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    const newList = await ProblemList.create({
      title: title.trim(),
      description: description?.trim() || "",
      owner: session.user.id,
      isPublic: Boolean(isPublic),
    });

    return NextResponse.json(
      { message: "Problem list created successfully", list: newList },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create problem list", details: message },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @desc Fetch the authenticated user's problem lists
 */
export async function GET() {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    // Fetch lists belonging to the currently authenticated user
    const lists = await ProblemList.find({ owner: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ lists }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch problem lists", details: message },
      { status: 500 }
    );
  }
}
