import { NextRequest, NextResponse } from "next/server";
import { connectionToDatabase } from "@/lib/db";
import TestCase from "@/models/testcase.model";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { TestCaseSchema } from "@/lib/validations";

// Next.js 15: params is a Promise
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET: Fetch a single test case by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await connectionToDatabase();

    const testCase = await TestCase.findById(id);

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testCase, { status: 200 });
  } catch (error) {
    console.log("Error in GET/testcases/[id]", error);
    return NextResponse.json(
      { error: "Error retrieving test case" },
      { status: 500 }
    );
  }
}

// PUT: Update a test case
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectionToDatabase();
    const body = await request.json();

    const validation = TestCaseSchema.partial().safeParse(body);
    
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

    const updatedTestCase = await TestCase.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedTestCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTestCase, { status: 200 });
  } catch (error) {
    console.log("Error in POST/testcases/[id]", error);

    return NextResponse.json(
      { error: "Failed to update test case" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a test case
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectionToDatabase();

    const deletedTestCase = await TestCase.findByIdAndDelete(id);

    if (!deletedTestCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Test case deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in DELETE/testcases/[id]", error);

    return NextResponse.json(
      { error: "Failed to delete test case" },
      { status: 500 }
    );
  }
}
