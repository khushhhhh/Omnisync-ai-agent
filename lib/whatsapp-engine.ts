import { Client, LocalAuth } from "whatsapp-web.js";
import QRCode from "qrcode";

declare global {
  var whatsappClient: Client | undefined;
}

export async function getWhatsAppClient(): Promise<Client> {
  if (globalThis.whatsappClient) {
    return globalThis.whatsappClient;
  }

  console.log("Initializing WhatsApp Client...");

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: ".wweb_session"
    }),
    puppeteer: {
      headless: true,
      executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        // Ek temporary profile folder de rahe hain taaki tere main Brave se clash na ho
        "--user-data-dir=/tmp/whatsapp_bot_profile"
      ]
    }
  });

  client.on("qr", (qr) => {
    console.log("\n========================================================");
    console.log("WhatsApp QR received. Please scan via WhatsApp mobile app:");
    QRCode.toString(qr, { type: "terminal" }, (err, url) => {
      if (err) {
        console.error("Failed to render QR Code in terminal:", err);
      } else {
        console.log(url);
      }
    });
    console.log("========================================================\n");
  });

  client.on("ready", () => {
    console.log("WhatsApp Client is connected and ready!");
  });

  client.on("message", (msg) => {
    console.log(`[WhatsApp Message] from ${msg.from}: ${msg.body}`);
  });

  client.on("auth_failure", (msg) => {
    console.error("WhatsApp Authentication failed:", msg);
  });

  client.on("disconnected", (reason) => {
    console.warn("WhatsApp Client was disconnected:", reason);
  });

  // Trigger non-blocking background initialization
  client.initialize().catch((err) => {
    console.error("WhatsApp client initialization exception:", err);
  });

  globalThis.whatsappClient = client;
  return client;
}
