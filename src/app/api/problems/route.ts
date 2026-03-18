import { NextRequest, NextResponse } from "next/server";
import Problem from "@/models/problem.model";
import { connectionToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { ProblemSchema } from "@/lib/validations";


/**
 * @method GET
 * @desc Fetch all problems with pagination and filtering
 */
export async function GET(req: NextRequest) {
  try {
    await connectionToDatabase();

    const searchParams = req.nextUrl.searchParams;

    // 1. Extract & Parse Query Params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query");
    const sort = searchParams.get("sort") || "newest"; // Default to newest

    // Helper to split "Easy,Medium" into ["Easy", "Medium"]
    const parseParam = (key: string) => {
      const val = searchParams.get(key);
      if (!val) return undefined;
      return val.split(",");
    };

    const difficulties = parseParam("difficulty");
    const topics = parseParam("topics");
    const statuses = parseParam("status"); // ["Solved", "Unsolved"]

    // 2. Get User Session (NextAuth)
    const session = await getServerSession(AuthOptions);
    const userId = session?.user ? session.user.id : null;

    // 3. Build Aggregation Pipeline
    const pipeline: mongoose.PipelineStage[] = [];

    // --- A. Match Stage (Basic Filters) ---
    const matchStage: mongoose.FilterQuery<typeof Problem> = {};

    if (difficulties && difficulties.length > 0) {
      matchStage.difficulty = { $in: difficulties };
    }

    if (topics && topics.length > 0) {
      matchStage.topics = { $in: topics };
    }

    if (query) {
      matchStage.$or = [
        { title: { $regex: query, $options: "i" } },
        { problemId: { $regex: query, $options: "i" } },
      ];
    }

    pipeline.push({ $match: matchStage });

// --- B. Lookup & Status Enrichment (If User Authenticated) ---
if (userId) {
  pipeline.push(
    {
      $lookup: {
        from: "submissions", // Ensure this matches your actual MongoDB collection name
        let: { probId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$problemId", "$$probId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
          { $project: { status: 1, _id: 0 } },
        ],
        as: "userSubmissions",
      },
    },
    {
      $addFields: {
        status: {
          $cond: {
            if: {
              // 1. Check if any submission has the status "accepted"
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$userSubmissions",
                      as: "sub",
                      cond: { $eq: ["$$sub.status", "accepted"] }, // Fixed: "success" -> "accepted"
                    },
                  },
                },
                0,
              ],
            },
            then: "Solved",
            else: {
              $cond: {
                // 2. If submissions exist but none are "accepted" -> "Attempted"
                if: { $gt: [{ $size: "$userSubmissions" }, 0] },
                then: "Attempted",
                else: "Unsolved",
              },
            },
          },
        },
      },
    },
    { $project: { userSubmissions: 0 } } // Clean up temp array
  );
} else {
  // Always return "Unsolved" for non-logged-in users
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
    let sortStage: mongoose.SortOrder | Record<string, 1|-1> = {
      createdAt: -1,
    }; // Default fallback

    // Map difficulty to numeric weights for logical sorting
    if (sort === "difficulty_asc" || sort === "difficulty_desc") {
      pipeline.push({
        $addFields: {
          difficultyWeight: {
            $switch: {
              branches: [
                { case: { $eq: ["$difficulty", "Easy"] }, then: 1 },
                { case: { $eq: ["$difficulty", "Medium"] }, then: 2 },
                { case: { $eq: ["$difficulty", "Hard"] }, then: 3 },
              ],
              default: 0,
            },
          },
        },
      });
    }

    switch (sort) {
      case "oldest":
        sortStage = { createdAt: 1 };
        break;
      case "newest":
        sortStage = { createdAt: -1 };
        break;
      case "title_asc":
        sortStage = { title: 1 };
        break;
      case "title_desc":
        sortStage = { title: -1 };
        break;
      case "difficulty_asc":
        sortStage = { difficultyWeight: 1 };
        break;
      case "difficulty_desc":
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
        totalDocs: "totalProblems",
        docs: "problems",
        limit: "pageSize",
        page: "currentPage",
        nextPage: "next",
        prevPage: "prev",
        totalPages: "totalPages",
        pagingCounter: "slNo",
        meta: "paginator",
      },
    };

    // Execute
    const myAggregate = Problem.aggregate(pipeline);

    // @ts-expect-error - to ignore error: 'Problem.aggregatePaginate' is of type 'unknown'.ts(18046)
    const result = await Problem.aggregatePaginate(myAggregate, options);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/problems Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch problems", details: message },
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
    const session = await getServerSession(AuthOptions);

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();
    const body = await req.json();

    // 1. Zod Validation for strict type safety and value checking
    const validation = ProblemSchema.safeParse(body);
    
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

    // Check for duplicate problemId
    const existingProblem = await Problem.findOne({
      problemId: validatedData.problemId,
    });
    if (existingProblem) {
      return NextResponse.json(
        { error: "Problem ID already exists" },
        { status: 409 }
      );
    }

    const newProblem = await Problem.create(validatedData);

    return NextResponse.json(
      { message: "Problem created successfully", problem: newProblem },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/problems Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to create problem", details: message },
      { status: 500 }
    );
  }
}
