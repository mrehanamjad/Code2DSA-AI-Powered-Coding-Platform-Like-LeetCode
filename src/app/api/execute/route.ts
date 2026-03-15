import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.ONECOMPILER_RAPID_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, files, stdin = "" } = body;

    if (!language || !files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: language and files are required." },
        { status: 400 }
      );
    }

    if (!RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: "ONECOMPILER_RAPID_API_KEY is not defined." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, stdin, files }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Upstream error ${response.status}: ${text}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/execute] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
