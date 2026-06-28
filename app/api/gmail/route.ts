import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getOAuthClient, loadSavedTokens, getAuthUrl, isClientAuthenticated } from "@/lib/google-auth";
import { synthesizeEmails } from "@/lib/ai-summarizer";

export async function GET() {
  try {
    let emails: any[] = [];
    let authenticated = false;
    let authUrl = null;

    try {
      // 1. Check if the user is authenticated via local token store
      if (!isClientAuthenticated()) {
        authUrl = getAuthUrl();
      } else {
        // 2. Load credentials and configure OAuth2 client
        const oauth2Client = getOAuthClient();
        const tokens = loadSavedTokens();
        oauth2Client.setCredentials(tokens);

        // 3. Initialize Gmail client using official SDK
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        // Fetch the user's latest unread primary messages
        const response = await gmail.users.messages.list({
          userId: "me",
          maxResults: 5,
          q: "is:unread category:primary",
        });

        const messages = response.data.messages || [];
        const rawEmails = [];

        for (const msg of messages) {
          if (!msg.id) continue;
          const detail = await gmail.users.messages.get({
            userId: "me",
            id: msg.id,
          });

          const headers = detail.data.payload?.headers || [];
          const subjectHeader = headers.find(h => h.name?.toLowerCase() === "subject");
          const fromHeader = headers.find(h => h.name?.toLowerCase() === "from");

          rawEmails.push({
            id: msg.id,
            subject: subjectHeader?.value || "(No Subject)",
            sender: fromHeader?.value || "Unknown Sender",
            snippet: detail.data.snippet || "",
          });
        }

        // If no unread primary emails, fall back to general inbox messages
        if (rawEmails.length === 0) {
          const generalResponse = await gmail.users.messages.list({
            userId: "me",
            maxResults: 5,
          });
          const generalMessages = generalResponse.data.messages || [];
          for (const msg of generalMessages) {
            if (!msg.id) continue;
            const detail = await gmail.users.messages.get({
              userId: "me",
              id: msg.id,
            });
            const headers = detail.data.payload?.headers || [];
            const subjectHeader = headers.find(h => h.name?.toLowerCase() === "subject");
            const fromHeader = headers.find(h => h.name?.toLowerCase() === "from");

            rawEmails.push({
              id: msg.id,
              subject: subjectHeader?.value || "(No Subject)",
              sender: fromHeader?.value || "Unknown Sender",
              snippet: detail.data.snippet || "",
            });
          }
        }

        emails = await synthesizeEmails(rawEmails);
        authenticated = true;
      }
    } catch (googleError) {
      console.warn("[Gmail API GET]: Google OAuth / credentials.json missing or configuration failed. Falling back to offline simulated briefs.", googleError);
      
      emails = [
        {
          id: "mock-gmail-1",
          title: "Review Q3 Launch Strategy Document",
          priority: "HIGH",
          platform: "GMAIL",
          time: "10 mins ago",
          summary: "Email from John Doe: Please review the attached launch strategy plan and provide your approval by Friday.",
          suggestedDraft: "Hi John,\n\nI have received the launch strategy document. I'll review it and get back to you with comments shortly.\n\nBest,",
          extractedEmail: "john.doe@company.com",
          subject: "Q3 Launch Strategy Document",
        },
        {
          id: "mock-gmail-2",
          title: "Production Incident Alert: CPU Spike",
          priority: "URGENT",
          platform: "GMAIL",
          time: "Just now",
          summary: "AWS CloudWatch Alert: instance-42 is experiencing >90% CPU usage for the last 5 minutes.",
          suggestedDraft: "Hi team,\n\nAlert processed automatically. I am running memory profiling diagnostics now.\n\nBest regards,",
          extractedEmail: "alerts@amazonaws.com",
          subject: "Alert: CPU Spike on instance-42",
        }
      ];
    }

    return NextResponse.json({ emails, authenticated, authUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[Gmail API GET Error]:", error);
    
    // Always fallback to a 200 response with simulated data rather than crashing
    return NextResponse.json({
      emails: [
        {
          id: "mock-gmail-1",
          title: "Review Q3 Launch Strategy Document",
          priority: "HIGH",
          platform: "GMAIL",
          time: "10 mins ago",
          summary: "Email from John Doe: Please review the attached launch strategy plan and provide your approval by Friday.",
          suggestedDraft: "Hi John,\n\nI have received the launch strategy document. I'll review it and get back to you with comments shortly.\n\nBest,",
          extractedEmail: "john.doe@company.com",
          subject: "Q3 Launch Strategy Document",
        }
      ],
      authenticated: false,
      authUrl: null,
      error: message
    });
  }
}
