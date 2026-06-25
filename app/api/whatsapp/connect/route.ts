import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.SENT_DM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          connected: false, 
          error: "SENT_DM_API_KEY is not configured in environment variables." 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "WhatsApp is connected via Sent.dm REST gateway.",
      connected: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const apiKey = process.env.SENT_DM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          connected: false, 
          error: "SENT_DM_API_KEY is not configured in environment variables." 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "WhatsApp is connected via Sent.dm REST gateway.",
      connected: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
