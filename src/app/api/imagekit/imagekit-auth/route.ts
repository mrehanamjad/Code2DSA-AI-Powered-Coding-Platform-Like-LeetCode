import { NextResponse } from "next/server";
import { imagekit } from "../imagekitCredentials";


export async function GET() {
  try {
    const authParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParameters);
  } catch (error) {
    console.error("Error in ImageKit authentication:", error);
    return NextResponse.json(
      { error: "Imagekit Failed" },
      { status: 500 }
    );
  }
}