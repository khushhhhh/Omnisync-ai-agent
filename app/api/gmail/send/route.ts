import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getOAuthClient, loadSavedTokens, isClientAuthenticated } from "@/lib/google-auth";

export async function POST(request: Request) {
  try {
    // 1. Confirm client is authenticated with Google
    if (!isClientAuthenticated()) {
      return NextResponse.json(
        { error: "Unauthorized: Gmail client is not authenticated." },
        { status: 401 }
      );
    }

    // 2. Extract transmission payload parameters
    const { to, subject, body } = await request.json() as { 
      to: string; 
      subject: string; 
      body: string; 
    };

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing required parameters. 'to', 'subject', and 'body' are required." },
        { status: 400 }
      );
    }

    // 3. Configure OAuth client with stored credentials
    const oauth2Client = getOAuthClient();
    const tokens = loadSavedTokens();
    oauth2Client.setCredentials(tokens);

    // 4. Initialize Gmail client
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 5. Build raw MIME email structure
    const rawMessage = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      "",
      body,
    ].join("\n");

    // 6. Encode string to base64url format required by Gmail API
    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 7. Dispatch the email
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send email via Gmail API.";
    console.error("[Gmail Send API POST Error]:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
