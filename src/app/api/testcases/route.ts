import { NextRequest, NextResponse } from "next/server";
import TestCase from "@/models/testcase.model";
import { connectionToDatabase } from "@/lib/db";

// GET: Fetch all test cases, or filter by 'problemId' query param
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
    console.log("POST :: testcase API :: Called")
    await connectionToDatabase();
    const body = await request.json();

    // Basic validation
    if (!body.problemId || !body.input || body.expected === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: problemId, input, or expected" },
        { status: 400 }
      );
    }
    const newTestCase = await TestCase.create(body);

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error) {
    console.error("Error creating test case:", error);
    return NextResponse.json(
      { error: "Failed to create test case" },
      { status: 500 }
    );
  }
}