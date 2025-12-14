import { connectionToDatabase } from "@/lib/db";
import UserStatistic, { UserStatisticI } from "@/models/userStatistic.model";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await  params;
    await connectionToDatabase();

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid userId" },
        { status: 400 }
      );
    }
    
    const userStats = await UserStatistic.findOne({ userId: new Types.ObjectId(userId) }) as UserStatisticI;
    if (!userStats) {
      return NextResponse.json({ message: "User statistics not found" }, { status: 404 });
    }

    return NextResponse.json(userStats, { status: 200 });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return NextResponse.json(
      { message: "Server Error: Error fetching user statistics" },
      { status: 500 }
    );
  }
}
