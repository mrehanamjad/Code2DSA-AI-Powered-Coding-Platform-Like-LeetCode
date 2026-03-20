import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { deleteImageFromImageKit } from "@/app/api/imagekit/delete-file/deleteimage";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url, id } = await req.json();

    if (!url || !id) {
      return NextResponse.json(
        { success: false, error: "Avatar url and id are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 400 }
      );
    }

    await connectionToDatabase();

    const user = await User.findById(session.user.id).select("avatar");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const previousAvatarId = user.avatar?.id;

    user.avatar = {
      url,
      id,
    };

    await user.save();

    /**
     * Non-blocking delete
     * prevents slow API responses
     */
    if (previousAvatarId && previousAvatarId !== id) {
      deleteImageFromImageKit(previousAvatarId).catch((err) =>
        console.error("ImageKit delete error:", err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        avatar: user.avatar,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Avatar update error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update avatar",
      },
      { status: 500 }
    );
  }
}