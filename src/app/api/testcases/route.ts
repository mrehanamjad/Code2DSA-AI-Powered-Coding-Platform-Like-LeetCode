import { NextRequest, NextResponse } from "next/server";
import TestCase from "@/models/testcase.model";
import { connectionToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { TestCaseSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    await connectionToDatabase();

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    const query = problemId ? { problemId } : {};

    const testCases = await TestCase.find(query);

    return NextResponse.json(testCases, { status: 200 });
  } catch (error) {
    console.error("Error fetching test cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch test cases" },
      { status: 500 }
    );
  }
}

// POST: Create a new test case
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if(!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();
    const body = await request.json();

    // 1. Zod Validation for strict type safety and value checking
    const postSchema = TestCaseSchema.extend({
      problemId: z.string().min(1, "Problem ID is required"),
    });

    const validation = postSchema.safeParse(body);
    
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

    const newTestCase = await TestCase.create(validatedData);

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error) {
    console.error("Error creating test case:", error);
    return NextResponse.json(
      { error: "Failed to create test case" },
      { status: 500 }
    );
  }
}