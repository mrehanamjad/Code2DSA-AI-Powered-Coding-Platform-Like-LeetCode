import { connectionToDatabase } from "@/lib/db";
import User, { UserI } from "@/models/user.model";
import UserStatistic, { UserStatisticI } from "@/models/userStatistic.model";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await  params;
    console.log("i am api ualled,",userId)
    await connectionToDatabase();

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid userId" },
        { status: 400 }
      );
    }
    console.log("goging to get userSatas")
    const userStats = await UserStatistic.findOne({ userId: new Types.ObjectId(userId) }) as UserStatisticI;
    console.log("--> stats --->",userStats)
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
