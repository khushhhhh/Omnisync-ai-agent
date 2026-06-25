import { NextResponse } from "next/server";
import { getWhatsAppClient } from "@/lib/whatsapp-engine";

export async function GET() {
  try {
    const client = await getWhatsAppClient();

    // If client.info is not defined, we are not logged in yet
    if (!client.info) {
      return NextResponse.json({
        status: "authenticating",
        message: "WhatsApp client is pairing or waiting for QR scan. Please check terminal.",
        chats: []
      });
    }

    const chats = await client.getChats();
    const latestChats = chats.slice(0, 10);

    const formattedChats = await Promise.all(
      latestChats.map(async (chat) => {
        let lastMessageBody = "";
        let lastMessageTimestamp = chat.timestamp;
        
        try {
          const msgs = await chat.fetchMessages({ limit: 1 });
          if (msgs && msgs.length > 0) {
            lastMessageBody = msgs[0].body;
            lastMessageTimestamp = msgs[0].timestamp;
          }
        } catch (e) {
          console.warn(`Failed to fetch last message for WhatsApp chat ${chat.name}:`, e);
        }

        return {
          id: chat.id._serialized,
          name: chat.name || "Unknown Chat",
          unreadCount: chat.unreadCount,
          timestamp: lastMessageTimestamp,
          lastMessageBody: lastMessageBody,
        };
      })
    );

    return NextResponse.json({
      status: "connected",
      chats: formattedChats
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[WhatsApp Messages API Route Error]:", error);
    return NextResponse.json(
      { status: "error", error: message, chats: [] },
      { status: 500 }
    );
  }
}
