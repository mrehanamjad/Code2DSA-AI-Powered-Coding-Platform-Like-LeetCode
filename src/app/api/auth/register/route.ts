import { NextRequest, NextResponse } from "next/server";
import { connectionToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import UserStatistic from "@/models/userStatistic.model";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const userName = email.split("@")[0] +  Math.floor(Math.random() * 999) + 1;

    await connectionToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({ email, password,userName,name });

    await UserStatistic.create({ userId: user._id });


    return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
    );

  } catch (error) {
    console.log("Error in user registration:", error);
        return NextResponse.json(
            { error: "Server Error. Try again later." },
            { status: 500 }
        )
  }
}