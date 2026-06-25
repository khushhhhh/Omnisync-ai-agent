export interface TelegramTask {
  id: string;
  title: string;
  priority: "URGENT" | "HIGH" | "NORMAL";
  platform: "TELEGRAM";
  time: string;
  summary: string;
}

export interface TelegramSyncResult {
  highestUpdateId: number;
  tasks: TelegramTask[];
}

export async function fetchTelegramTasks(
  botToken: string,
  lastUpdateId = 0
): Promise<TelegramSyncResult> {
  if (!botToken || botToken === "placeholder") {
    console.warn("No bot token provided.");
    return { highestUpdateId: lastUpdateId, tasks: [] };
  }

  // 1. Fetch unread messages from Telegram (NUCLEAR CACHE BUSTER ADDED)
  const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}&t=${Date.now()}`;
  console.log("🚀 [DEBUG] Hitting Telegram API with URL:", url);

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Telegram API responded with status ${res.status}`);

  const data = await res.json();
  console.log("📦 [DEBUG] Telegram Data Received:", JSON.stringify(data.result));

  const updates = data.result || [];
  if (updates.length === 0) {
    console.log("⚠️ [DEBUG] No new messages found in Telegram Queue.");
    return { highestUpdateId: lastUpdateId, tasks: [] };
  }

  const highestUpdateId = Math.max(...updates.map((u: any) => u.update_id));
  const messages = updates
    .map((u: any) => u.message?.text)
    .filter((text: any) => typeof text === "string" && text.trim().length > 0);

  if (messages.length === 0) return { highestUpdateId, tasks: [] };

  // 2. Strict Prompt for Gemini
  const prompt = `
You are an AI parsing informal notes into actionable tasks. 
Return STRICTLY a valid JSON object. DO NOT wrap it in markdown backticks.
Schema required:
{
  "highestUpdateId": ${highestUpdateId},
  "tasks": [{ "id": "uuid", "title": "Actionable title", "priority": "HIGH", "platform": "TELEGRAM", "time": "Just now", "summary": "1 sentence" }]
}
Messages: ${JSON.stringify(messages)}
`;

  // 3. Direct API Hit to 2.0-flash (The only model your key allows)
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const result = await response.json();

  // 4. Graceful Rate Limit Handling
  if (!response.ok) {
    if (response.status === 429) {
      // 1. Terminal me bata dega ki quota full hai
      console.error("Gemini Quota Exceeded (429). Waiting for reset.");

      // 2. App ko crash hone se bacha lega aur khali array bhej dega
      return { highestUpdateId: lastUpdateId, tasks: [] };
    }
    throw new Error(`Gemini Error: ${JSON.stringify(result)}`);
  }

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini.");

  // 5. Clean string from AI artifacts
  const cleanText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

  return JSON.parse(cleanText) as TelegramSyncResult;
}