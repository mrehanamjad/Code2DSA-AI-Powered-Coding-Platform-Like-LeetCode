import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import Problem from "@/models/problem.model";
import Submission from "@/models/submission.model";
import { connectionToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();

    const [totalUsers, totalProblems, totalSubmissions, acceptedSubmissions] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: "accepted" }),
    ]);

    const successRate = totalSubmissions > 0 
      ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) 
      : 0;

    // Get recent activity (last 5 submissions)
    const recentSubmissions = await Submission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "userName name avatar")
      .populate("problemId", "title difficulty");

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProblems,
        totalSubmissions,
        successRate,
      },
      recentSubmissions,
    }, { status: 200 });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
