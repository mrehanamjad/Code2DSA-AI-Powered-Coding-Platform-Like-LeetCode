import { NextRequest, NextResponse } from 'next/server';
import Problem from '@/models/problem.model';
import { connectionToDatabase } from '@/lib/db';
import Submission from '@/models/submission.model';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth';

/**
 * @method GET
 * @desc Fetch all problems with pagination and filtering
 */

// export async function GET(req: NextRequest) {
//   try {
//     await connectionToDatabase();

//     const { searchParams } = new URL(req.url);
    
//     // Extract Query Params
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const difficulty = searchParams.get('difficulty');
//     const topics = searchParams.get('topics');
//     const search = searchParams.get('query');

//     // Build Aggregation Pipeline
//     const pipeline: any[] = [];

//     // 1. Filtering
//     if (difficulty) {
//       pipeline.push({ $match: { difficulty: difficulty } });
//     }

//     if (topics) {
//       pipeline.push({ $match: { topics: { $in: [topics] } } });
//     }

//     if (search) {
//       // Simple regex search on title or problemId
//       pipeline.push({
//         $match: {
//           $or: [
//             { title: { $regex: search, $options: 'i' } },
//             { problemId: { $regex: search, $options: 'i' } }
//           ]
//         }
//       });
//     }

//     // 2. Sorting (Optional - Default by newest)
//     pipeline.push({ $sort: { createdAt: -1 } });

//     // 3. Use aggregatePaginate
//     const options = {
//       page,
//       limit,
//     };

//     // Create the aggregate object
//     const myAggregate = Problem.aggregate(pipeline);
    
//     // Execute pagination
//     const result = await Problem.aggregatePaginate(myAggregate, options);

//     return NextResponse.json(result, { status: 200 });

//   } catch (error: any) {
//     console.error("GET /api/problems Error:", error);
//     return NextResponse.json(
//       { error: 'Failed to fetch problems', details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    await connectionToDatabase();

    const searchParams = req.nextUrl.searchParams;
    
    // 1. Extract & Parse Query Params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const query = searchParams.get('query');
    const sort = searchParams.get('sort') || 'newest'; // Default to newest
    
    // Helper to split "Easy,Medium" into ["Easy", "Medium"]
    const parseParam = (key: string) => {
      const val = searchParams.get(key);
      if (!val) return undefined;
      return val.split(',');
    };

    const difficulties = parseParam('difficulty');
    const topics = parseParam('topics');
    const statuses = parseParam('status'); // ["Solved", "Unsolved"]

    // 2. Get User Session (NextAuth)
    const session = await getServerSession(AuthOptions);
    const userId = session?.user ? (session.user as any).id : null;

    // 3. Build Aggregation Pipeline
    const pipeline: any[] = [];

    // --- A. Match Stage (Basic Filters) ---
    const matchStage: any = {};

    if (difficulties && difficulties.length > 0) {
      matchStage.difficulty = { $in: difficulties };
    }

    if (topics && topics.length > 0) {
      matchStage.topics = { $in: topics };
    }

    if (query) {
      matchStage.$or = [
        { title: { $regex: query, $options: 'i' } },
        { problemId: { $regex: query, $options: 'i' } }
      ];
    }

    pipeline.push({ $match: matchStage });

    // --- B. Lookup & Status Enrichment (If User Authenticated) ---
    if (userId) {
      pipeline.push(
        // 1. Join with Submissions to find user's history for these problems
        {
          $lookup: {
            from: "submissions",
            let: { problemId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$problemId", "$$problemId"] },
                      { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] }
                    ]
                  }
                }
              },
              { $project: { status: 1, _id: 0 } }
            ],
            as: "userSubmissions"
          }
        },
        // 2. Calculate 'status' field based on submissions
        {
          $addFields: {
            status: {
              $cond: {
                if: {
                  // Check if ANY submission is 'success'
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$userSubmissions",
                          as: "sub",
                          cond: { $eq: ["$$sub.status", "success"] }
                        }
                      }
                    },
                    0
                  ]
                },
                then: "Solved",
                else: {
                  $cond: {
                    // If any submissions exist but none are success -> Attempted
                    if: { $gt: [{ $size: "$userSubmissions" }, 0] },
                    then: "Attempted",
                    else: "Unsolved"
                  }
                }
              }
            }
          }
        },
        // 3. Clean up the joined array
        { $project: { userSubmissions: 0 } }
      );
    } else {
      // If not logged in, implicitly all are "Unsolved" (or generic)
      // We add the field so the response structure is consistent
      pipeline.push({ $addFields: { status: "Unsolved" } });
    }

    // --- C. Match Stage (Status Filter) ---
    // This must run AFTER the lookup/addFields calculation
    if (statuses && statuses.length > 0) {
      if (userId) {
        pipeline.push({ $match: { status: { $in: statuses } } });
      } else {
        // If filtering by Status but not logged in:
        // Only return results if they asked for 'Unsolved' (default)
        if (statuses.includes("Unsolved") && statuses.length === 1) {
           // Pass through (all are treated as unsolved)
        } else {
           // If they asked for 'Solved' or 'Attempted' but aren't logged in, return nothing
           pipeline.push({ $match: { _id: null } }); 
        }
      }
    }

    // --- D. Sorting Logic ---
    let sortStage: any = { createdAt: -1 }; // Default fallback

    // Map difficulty to numeric weights for logical sorting
    if (sort === 'difficulty_asc' || sort === 'difficulty_desc') {
      pipeline.push({
        $addFields: {
          difficultyWeight: {
            $switch: {
              branches: [
                { case: { $eq: ["$difficulty", "Easy"] }, then: 1 },
                { case: { $eq: ["$difficulty", "Medium"] }, then: 2 },
                { case: { $eq: ["$difficulty", "Hard"] }, then: 3 }
              ],
              default: 0
            }
          }
        }
      });
    }

    switch (sort) {
      case 'oldest':
        sortStage = { createdAt: 1 };
        break;
      case 'newest':
        sortStage = { createdAt: -1 };
        break;
      case 'title_asc':
        sortStage = { title: 1 };
        break;
      case 'title_desc':
        sortStage = { title: -1 };
        break;
      case 'difficulty_asc':
        sortStage = { difficultyWeight: 1 };
        break;
      case 'difficulty_desc':
        sortStage = { difficultyWeight: -1 };
        break;
      default:
        sortStage = { createdAt: -1 };
    }

    pipeline.push({ $sort: sortStage });

    // 4. Pagination
    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: 'totalProblems',
        docs: 'problems',
        limit: 'pageSize',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'totalPages',
        pagingCounter: 'slNo',
        meta: 'paginator',
      },
    };

    // Execute
    const myAggregate = Problem.aggregate(pipeline);
    
    // @ts-ignore
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