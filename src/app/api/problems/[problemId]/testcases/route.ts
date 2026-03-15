import { NextRequest, NextResponse } from "next/server";
import Problem from "@/models/problem.model";
import TestCase from "@/models/testcase.model";
import { connectionToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { TestCaseSchema } from "@/lib/validations";

type Props = {
  params: Promise<{
    problemId: string;
  }>;
};

/**
 * @method GET
 * @desc Fetch all test cases for a specific problem
 */
export async function GET(req: NextRequest, { params }: Props) {
  try {
    await connectionToDatabase();
    const { problemId } = await params;

    // First find the problem's internal ID
    const problem = await Problem.findOne({ problemId });
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const testCases = await TestCase.find({ problemId: problem._id });
    return NextResponse.json(testCases, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @desc Create a new test case for a specific problem
 */
export async function POST(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(AuthOptions);
    if (!session?.user.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();
    const { problemId } = await params;
    const body = await req.json();

    // 1. Zod Validation for strict type safety and value checking
    const validation = TestCaseSchema.safeParse(body);
    
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

    const problem = await Problem.findOne({ problemId });
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const newTestCase = await TestCase.create({
      ...validatedData,
      problemId: problem._id,
    });

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create test case", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
