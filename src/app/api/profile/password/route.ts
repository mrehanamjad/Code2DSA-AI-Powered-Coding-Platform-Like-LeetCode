import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function PATCH(request: Request) {
  try {
    await connectionToDatabase();
    const session = await getServerSession(AuthOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = passwordSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
    }

    const { currentPassword, newPassword } = parseResult.data;

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 403 });
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Password Update Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: "Internal Server Error" + message }, { status: 500 });
  }
}