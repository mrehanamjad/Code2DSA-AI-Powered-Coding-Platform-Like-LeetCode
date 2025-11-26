import { NextRequest, NextResponse } from 'next/server';
import Problem from '@/models/problem.model';
import { connectionToDatabase } from '@/lib/db';
import TestCase from '@/models/testcase.model';

// Define params type for App Router
type Props = {
  params: {
    problemId: string;
  };
};

/**
 * @method GET
 * @desc Fetch a single problem by problemId
 */
// export async function GET(req: NextRequest, { params }: Props) {
//   try {
//     await connectionToDatabase();
    
//     const { problemId } = params;

//     const problem = await Problem.findOne({ problemId });
//     if (!problem) {
//       return NextResponse.json(
//         { error: 'Problem not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(problem, { status: 200 });

//   } catch (error: any) {
//     return NextResponse.json(
//       { error: 'Internal Server Error', details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await connectionToDatabase();

    const { problemId } = params;

    // 1. Find the problem by its public problemId string
    const problem = await Problem.findOne({ problemId });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
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
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
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
    await connectionToDatabase();
    
    const { problemId } = params;
    const body = await req.json();

    // Prevent updating problemId if necessary, or check for duplicates if allowed
    if (body.problemId && body.problemId !== problemId) {
       const existing = await Problem.findOne({ problemId: body.problemId });
       if (existing) {
         return NextResponse.json(
           { error: 'New Problem ID is already taken' },
           { status: 409 }
         );
       }
    }

    const updatedProblem = await Problem.findOneAndUpdate(
      { problemId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Problem updated successfully', problem: updatedProblem },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update problem', details: error.message },
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
    await connectionToDatabase();
    
    const { problemId } = params;

    const deletedProblem = await Problem.findOneAndDelete({ problemId });

    if (!deletedProblem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Problem deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete problem', details: error.message },
      { status: 500 }
    );
  }
}