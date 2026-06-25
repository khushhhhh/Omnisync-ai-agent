import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gen AI client if the API key is provided
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface SynthesizedEmail {
  id: string;
  title: string;
  priority: "URGENT" | "HIGH" | "NORMAL";
  platform: "GMAIL";
  time: string;
  summary: string;
  suggestedDraft: string;
  extractedEmail: string;
  subject: string;
}

/**
 * Extracts raw email address from sender string like "Name <email@example.com>"
 */
function extractEmailAddress(sender: string): string {
  const match = sender.match(/<([^>]+)>/);
  if (match && match[1]) {
    return match[1].trim();
  }
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = sender.match(emailRegex);
  if (emailMatch && emailMatch[0]) {
    return emailMatch[0].trim();
  }
  return sender.trim();
}

/**
 * Synthesizes raw Gmail threads into action-oriented Command Center briefs
 */
export async function synthesizeEmails(
  emails: Array<{ id: string; subject: string; sender: string; snippet: string }>
): Promise<SynthesizedEmail[]> {
  if (emails.length === 0) {
    return [];
  }

  const prompt = `
You are the executive assistant of Neural OS. Read these raw emails and transform them into a strict JSON array matching this interface:
[{ 
  id: string (must match the original email id), 
  title: string (Action-oriented short title), 
  priority: 'URGENT' | 'HIGH' | 'NORMAL', 
  platform: 'GMAIL', 
  time: string (relative time, e.g., "5 mins ago", "1 hour ago"), 
  summary: string (One sentence concise explanation), 
  suggestedDraft: string (A pre-written 2-sentence professional reply) 
}]

Here are the raw emails:
${JSON.stringify(emails, null, 2)}
`;

  if (!ai) {
    console.warn("[AI Summarizer Warning]: GEMINI_API_KEY is not defined. Falling back to mock synthesis.");
    return generateMockSynthesis(emails);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsed = JSON.parse(text) as Omit<SynthesizedEmail, "extractedEmail" | "subject">[];
    return parsed.map((item) => {
      const original = emails.find((e) => e.id === item.id);
      return {
        ...item,
        subject: original ? original.subject : "",
        extractedEmail: original ? extractEmailAddress(original.sender) : "",
      } as SynthesizedEmail;
    });
  } catch (error) {
    console.error("[AI Summarizer Error]: Failed to synthesize emails via Gemini API.", error);
    console.warn("Falling back to local heuristic synthesis.");
    return generateMockSynthesis(emails);
  }
}

/**
 * Generates dynamic local mock synthesis for emails when API key is missing
 */
function generateMockSynthesis(
  emails: Array<{ id: string; subject: string; sender: string; snippet: string }>
): SynthesizedEmail[] {
  return emails.map((email, idx) => {
    // Generate a simple heuristic priority
    let priority: "URGENT" | "HIGH" | "NORMAL" = "NORMAL";
    const lowerSubject = email.subject.toLowerCase();
    if (lowerSubject.includes("urgent") || lowerSubject.includes("immediate") || lowerSubject.includes("blocker")) {
      priority = "URGENT";
    } else if (idx === 0 || lowerSubject.includes("action") || lowerSubject.includes("review") || lowerSubject.includes("pr")) {
      priority = "HIGH";
    }

    return {
      id: email.id,
      title: `Review: ${email.subject.replace(/^(re|fwd):\s*/i, "")}`,
      priority,
      platform: "GMAIL",
      time: idx === 0 ? "Just now" : `${idx * 15} mins ago`,
      summary: `Email from ${email.sender}: "${email.snippet.substring(0, 100)}..."`,
      suggestedDraft: `Hi,\n\nThanks for reaching out. I've received your request regarding "${email.subject}" and will review the details shortly.\n\nBest regards,`,
      extractedEmail: extractEmailAddress(email.sender),
      subject: email.subject,
    };
  });
}
