import { connectionToDatabase } from "@/lib/db";
import User, { UserI } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectionToDatabase();

    const url = new URL(req.url);
    const username = url.pathname.split("/").pop();

    if (!username) {
      return NextResponse.json(
        { message: "Invalid username" },
        { status: 400 }
      );
    }

    const user: UserI | null = await User.findOne({ userName: username });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    type PublicUser = Omit<UserI, "password">;
    const publicData: PublicUser = {
      _id: user._id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      phone: user.phone,
      bio: user.bio,
      level: user.level,
      score: user.score,
      maxStreak: user.maxStreak,
      currentStreak: user.currentStreak,
      languages: user.languages,
      skills: user.skills,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ data: publicData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
