import { NextRequest, NextResponse } from 'next/server';
import Problem from '@/models/problem.model';
import { connectionToDatabase } from '@/lib/db';

/**
 * @method GET
 * @desc Fetch all problems with pagination and filtering
 */

export async function GET(req: NextRequest) {
  try {
    await connectionToDatabase();

    const { searchParams } = new URL(req.url);
    
    // Extract Query Params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build Aggregation Pipeline
    const pipeline: any[] = [];

    // 1. Filtering
    if (difficulty) {
      pipeline.push({ $match: { difficulty: difficulty } });
    }

    if (category) {
      pipeline.push({ $match: { category: { $in: [category] } } });
    }

    if (search) {
      // Simple regex search on title or problemId
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { problemId: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // 2. Sorting (Optional - Default by newest)
    pipeline.push({ $sort: { createdAt: -1 } });

    // 3. Use aggregatePaginate
    const options = {
      page,
      limit,
    };

    // Create the aggregate object
    const myAggregate = Problem.aggregate(pipeline);
    
    // Execute pagination
    const result = await Problem.aggregatePaginate(myAggregate, options);

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error("GET /api/problems Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch problems', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @desc Create a new problem
 */
export async function POST(req: NextRequest) {
  try {
        console.log("POST :: problem API :: Called")

    await connectionToDatabase();
    const body = await req.json();

    // Basic validation check (Mongoose will handle detailed validation)
    if (!body.problemId || !body.title || !body.difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for duplicate problemId
    const existingProblem = await Problem.findOne({ problemId: body.problemId });
    if (existingProblem) {
      return NextResponse.json(
        { error: 'Problem ID already exists' },
        { status: 409 }
      );
    }

    const newProblem = await Problem.create(body);

    return NextResponse.json(
      { message: 'Problem created successfully', problem: newProblem },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("POST /api/problems Error:", error);
    return NextResponse.json(
      { error: 'Failed to create problem', details: error.message },
      { status: 500 }
    );
  }
}