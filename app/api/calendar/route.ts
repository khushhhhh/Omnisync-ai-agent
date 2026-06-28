import { NextResponse } from "next/server";
import { getOAuthClient, loadSavedTokens, isClientAuthenticated } from "@/lib/google-auth";
import { detectCalendarCollisions } from "@/lib/calendar-engine";

export async function GET() {
  try {
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
    } catch (googleError) {
      console.warn("[Calendar API GET]: Google OAuth/credentials configuration failed. Falling back to simulated collision analysis.", googleError);
      return NextResponse.json({
        collisionDetected: true,
        clashingTitles: ["Dentist Appointment", "Executive Board Sync"],
        lowerPriorityTitle: "Dentist Appointment",
        suggestedFix: "Reschedule Dentist Appointment to tomorrow 4:00 PM (Proposed free slot +30m)",
        reasoning: "Executive Board Sync involves external leadership and critical corporate approvals, making it high-priority, while Dentist Appointment is a private task that can easily be rescheduled.",
        simulated: true,
        authenticated: false
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[Calendar API GET Error]:", error);
    return NextResponse.json({
      collisionDetected: false,
      error: message
    });
  }
}
