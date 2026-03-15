import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const filter = query 
      ? { 
          $or: [
            { userName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { name: { $regex: query, $options: "i" } },
          ] 
        } 
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Users API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Support for updating user roles or deleting users can be added here
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectionToDatabase();
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Users API Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
