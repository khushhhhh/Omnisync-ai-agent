import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-auth";

export async function GET() {
  try {
    const authUrl = getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initiate Google Auth.";
    console.error("[Google Auth Redirect Error]:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
