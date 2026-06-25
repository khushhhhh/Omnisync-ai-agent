import { NextResponse } from "next/server";
import { getOAuthClient, loadSavedTokens, isClientAuthenticated } from "@/lib/google-auth";
import { detectCalendarCollisions } from "@/lib/calendar-engine";

export async function GET() {
  try {
    // 1. Confirm client is authenticated
    if (!isClientAuthenticated()) {
      return NextResponse.json({ 
        collisionDetected: false, 
        authenticated: false 
      });
    }

    // 2. Configure OAuth client using stored tokens
    const oauth2Client = getOAuthClient();
    const tokens = loadSavedTokens();
    oauth2Client.setCredentials(tokens);

    // 3. Detect calendar collisions
    const result = await detectCalendarCollisions(oauth2Client);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[Calendar API GET Error]:", error);
    return NextResponse.json(
      { error: message, collisionDetected: false },
      { status: 500 }
    );
  }
}
