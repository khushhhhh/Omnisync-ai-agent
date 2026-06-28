import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

// Fetch live workspace context to inject into the AI's system prompt
async function fetchWorkspaceContext(baseUrl: string): Promise<string> {
  const parts: string[] = [];

  try {
    const gmailRes = await fetch(`${baseUrl}/api/gmail`, { cache: "no-store" });
    const gmailData = await gmailRes.json();
    if (gmailData.emails && gmailData.emails.length > 0) {
      const emailSummaries = gmailData.emails
        .map((e: any) => `  - [${e.priority}] "${e.title}" — ${e.summary}`)
        .join("\n");
      parts.push(`ACTIVE EMAIL BRIEFS:\n${emailSummaries}`);
    } else {
      parts.push("ACTIVE EMAIL BRIEFS: No active emails found.");
    }
  } catch {
    parts.push("ACTIVE EMAIL BRIEFS: Gmail integration unavailable.");
  }

  try {
    const telegramRes = await fetch(`${baseUrl}/api/telegram/sync`, { cache: "no-store" });
    const telegramData = await telegramRes.json();
    if (telegramData.tasks && telegramData.tasks.length > 0) {
      const taskSummaries = telegramData.tasks
        .map((t: any) => `  - [${t.priority}] "${t.title}" — ${t.summary}`)
        .join("\n");
      parts.push(`TELEGRAM ACTION ITEMS:\n${taskSummaries}`);
    } else {
      parts.push("TELEGRAM ACTION ITEMS: No active tasks. Bot may not be configured.");
    }
  } catch {
    parts.push("TELEGRAM ACTION ITEMS: Telegram integration unavailable.");
  }

  try {
    const calendarRes = await fetch(`${baseUrl}/api/calendar`, { cache: "no-store" });
    const calendarData = await calendarRes.json();
    if (calendarData.collisionDetected) {
      parts.push(
        `CALENDAR CONFLICTS DETECTED:\n  - Clash: ${calendarData.clashingTitles?.join(" vs ")}\n  - Suggested Fix: ${calendarData.suggestedFix}\n  - Reasoning: ${calendarData.reasoning}`
      );
    } else {
      parts.push("CALENDAR CONFLICTS: None detected in the 48-hour window.");
    }
  } catch {
    parts.push("CALENDAR CONFLICTS: Calendar integration unavailable.");
  }

  try {
    const whatsappRes = await fetch(`${baseUrl}/api/whatsapp/messages`, { cache: "no-store" });
    const whatsappData = await whatsappRes.json();
    if (whatsappData.chats && whatsappData.chats.length > 0) {
      const chatSummaries = whatsappData.chats
        .map((c: any) => `  - "${c.name}" (${c.unreadCount} unread): "${c.lastMessageBody}"`)
        .join("\n");
      parts.push(`WHATSAPP ACTIVE CHATS:\n${chatSummaries}`);
    } else {
      parts.push("WHATSAPP ACTIVE CHATS: No active chats found.");
    }
  } catch {
    parts.push("WHATSAPP ACTIVE CHATS: WhatsApp integration unavailable.");
  }

  return parts.join("\n\n");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured. Please add your key to `.env.local` and restart the dev server.",
          unconfigured: true,
        },
        { status: 400 }
      );
    }

    const { messages } = (await request.json()) as RequestBody;
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // Build base URL for internal API fetches
    const { headers } = request;
    const host = headers.get("host") || "localhost:3002";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // Fetch live workspace context for the system prompt
    const workspaceContext = await fetchWorkspaceContext(baseUrl);

    const systemPrompt = `You are the OmniSync.ai Neural Command Agent — an elite, context-aware executive assistant embedded inside the user's personal AI command center. You have real-time access to their workspace data.

Your personality: Precise, professional, proactive. You speak like a top-tier Chief of Staff. You are terse and action-focused. You never add filler or unnecessary preamble.

You have access to the following LIVE WORKSPACE DATA (fetched seconds ago):

${workspaceContext}

Your capabilities:
- Summarize and prioritize email threads
- Draft professional email replies
- Extract and explain Telegram action items
- Analyze and resolve calendar conflicts
- Provide strategic executive guidance on task prioritization
- Answer questions about any workspace integration

Always respond in markdown. Use bold, bullet points, and code blocks where appropriate. Keep responses focused and executive-grade.`;

    // Convert messages to Gemini API format
    const geminiContents = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: geminiContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json();
      console.error("[Agent Chat API] Gemini error:", errorData);
      return NextResponse.json(
        { error: `Gemini API error: ${errorData?.error?.message || "Unknown error"}` },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const responseText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from agent.";

    return NextResponse.json({ response: responseText });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Agent chat failed.";
    console.error("[Agent Chat API Error]:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
