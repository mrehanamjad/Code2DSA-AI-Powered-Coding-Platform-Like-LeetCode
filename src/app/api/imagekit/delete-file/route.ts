import { NextResponse } from "next/server";
import { deleteImageFromImageKit } from "./deleteimage";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Image avatar ID is required" },
        { status: 400 }
      );
    }

    await deleteImageFromImageKit(id);

    return NextResponse.json(
      {
        success: true,
        message: "Avatar image deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Avatar Image:", error);

    return NextResponse.json(
      { error: "Failed to delete Avatar Image" },
      { status: 500 }
    );
  }
}