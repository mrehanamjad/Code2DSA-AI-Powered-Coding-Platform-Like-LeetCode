import { NextRequest, NextResponse } from "next/server";
import Problem from "@/models/problem.model";
import { connectionToDatabase } from "@/lib/db";
import TestCase from "@/models/testcase.model";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { ProblemSchema } from "@/lib/validations";

// Define params type for App Router
type Props = {
  params: Promise<{
    problemId: string;
  }>;
};

/**
 * @method GET
 * @desc Fetch a single problem by problemId
 */
export async function GET(req: NextRequest, { params }: Props) {
  try {
    await connectionToDatabase();

    const { problemId } = await params;

    // 1. Find the problem by its public problemId string
    const problem = await Problem.findOne({ problemId });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // 2. Find testcases linked via Mongo's _id (ObjectId)
    const testCases = await TestCase.find({ problemId: problem._id });

    // 3. Return combined data
    return NextResponse.json(
      {
        problem,
        testCases,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @desc Update a problem by problemId
 */
export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const { problemId } = await params;
    const body = await req.json();

    // 1. Zod Validation for strict type safety and value checking
    const validation = ProblemSchema.partial().safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.errors.map(e => ({ path: e.path, message: e.message })) 
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Prevent updating problemId if necessary, or check for duplicates if allowed
    if (validatedData.problemId && validatedData.problemId !== problemId) {
      const existing = await Problem.findOne({ problemId: validatedData.problemId });
      if (existing) {
        return NextResponse.json(
          { error: "New Problem ID is already taken" },
          { status: 409 }
        );
      }
    }

    const updatedProblem = await Problem.findOneAndUpdate(
      { problemId },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Problem updated successfully", problem: updatedProblem },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to update problem", details: message },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @desc Delete a problem by problemId
 */
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const { problemId } = await params;

    const deletedProblem = await Problem.findOneAndDelete({ problemId });

    if (!deletedProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Problem deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to delete problem", details: message },
      { status: 500 }
    );
  }
}
