export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { fetchTelegramTasks } from "@/lib/telegram-engine";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

    // 1. Retrieve the last processed update_id from the cookie store
    const cookieStore = await cookies();
    const lastUpdateIdCookie = cookieStore.get("tg_last_update_id");
    const lastUpdateId = lastUpdateIdCookie ? parseInt(lastUpdateIdCookie.value, 10) : 0;

    // 2. Fetch new updates
    const syncResult = await fetchTelegramTasks(botToken, lastUpdateId);

    // 3. Persist the new highestUpdateId back in a cookie if it has increased
    if (syncResult.highestUpdateId > lastUpdateId) {
      cookieStore.set("tg_last_update_id", syncResult.highestUpdateId.toString(), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year persistence
      });
    }

    // Determine if the environment variable is configured (non-placeholder)
    const isConfigured = !!process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== "placeholder";

    return NextResponse.json({
      tasks: syncResult.tasks,
      highestUpdateId: syncResult.highestUpdateId,
      isConfigured,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Telegram synchronization failed.";
    console.error("[Telegram Sync API Route GET Error]:", error);
    return NextResponse.json(
      { error: message, tasks: [] },
      { status: 500 }
    );
  }
}
