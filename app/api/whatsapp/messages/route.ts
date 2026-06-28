import { NextResponse } from "next/server";
import { getWhatsAppClient } from "@/lib/whatsapp-engine";

export async function GET() {
  try {
    let chats: any[] = [];
    let isMock = false;

    try {
      const client = await getWhatsAppClient();
      if (!client.info) {
        throw new Error("Client not authenticated / pairing mode.");
      }
      const rawChats = await client.getChats();
      const latestChats = rawChats.slice(0, 10);

      chats = await Promise.all(
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
    } catch (engineError) {
      console.warn("[WhatsApp GET API]: Local browser engine unavailable or unauthenticated. Falling back to premium simulated data.");
      isMock = true;
      chats = [
        {
          id: "919876543210@c.us",
          name: "Raghav (Product Lead)",
          unreadCount: 2,
          timestamp: Math.floor(Date.now() / 1000) - 180,
          lastMessageBody: "Did we migrate the WhatsApp gateway to Sent.dm yet? Let me know.",
        },
        {
          id: "919999888877@c.us",
          name: "Divya (Marketing Team)",
          unreadCount: 0,
          timestamp: Math.floor(Date.now() / 1000) - 3600,
          lastMessageBody: "The Q3 content calendar looks perfect. Approved!",
        },
        {
          id: "120363023847291834@g.us",
          name: "Tech Leads Sync Group",
          unreadCount: 0,
          timestamp: Math.floor(Date.now() / 1000) - 7200,
          lastMessageBody: "Let's review the API performance and response rates tomorrow morning.",
        }
      ];
    }

    return NextResponse.json({
      status: "connected",
      simulated: isMock,
      chats
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
