import { PublicUser } from "@/lib/apiClient/types";
import { connectionToDatabase } from "@/lib/db";
import User, { UserI } from "@/models/user.model";
import { NextResponse } from "next/server";

interface Params {
  username: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ message: "Invalid username" }, { status: 400 });
  }
  try {
    await connectionToDatabase();
    const user: UserI | null = await User.findOne({ userName: username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const publicData: PublicUser = {
      _id: user._id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ data: publicData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
