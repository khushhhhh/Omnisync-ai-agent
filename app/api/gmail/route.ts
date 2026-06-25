import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getOAuthClient, loadSavedTokens, getAuthUrl, isClientAuthenticated } from "@/lib/google-auth";
import { synthesizeEmails } from "@/lib/ai-summarizer";

export async function GET() {
  try {
    // 1. Check if the user is authenticated via local token store
    if (!isClientAuthenticated()) {
      const authUrl = getAuthUrl();
      return NextResponse.json({
        authenticated: false,
        authUrl,
      });
    }

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
    const emails = [];

    for (const msg of messages) {
      if (!msg.id) continue;
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const headers = detail.data.payload?.headers || [];
      const subjectHeader = headers.find(h => h.name?.toLowerCase() === "subject");
      const fromHeader = headers.find(h => h.name?.toLowerCase() === "from");

      emails.push({
        id: msg.id,
        subject: subjectHeader?.value || "(No Subject)",
        sender: fromHeader?.value || "Unknown Sender",
        snippet: detail.data.snippet || "",
      });
    }

    // If no unread primary emails, fall back to general inbox messages
    if (emails.length === 0) {
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

        emails.push({
          id: msg.id,
          subject: subjectHeader?.value || "(No Subject)",
          sender: fromHeader?.value || "Unknown Sender",
          snippet: detail.data.snippet || "",
        });
      }
    }

    const synthesized = await synthesizeEmails(emails);
    return NextResponse.json({ emails: synthesized, authenticated: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[Gmail API GET Error]:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
