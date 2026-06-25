/**
 * Sends a WhatsApp message using the Sent.dm API gateway.
 * @param phoneNumber The recipient's phone number (with country code, e.g. "919876543210")
 * @param message The text content of the message
 */
export async function sendWhatsAppMessage(
  phoneNumber: string, 
  message: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiKey = process.env.SENT_DM_API_KEY;
  if (!apiKey) {
    throw new Error("SENT_DM_API_KEY is not defined in the environment variables.");
  }

  // Ensure format is just digits, stripping out characters like "+", "-", " ", and "(", ")"
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  try {
    const response = await fetch("https://api.sent.dm/v1/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Sent.dm API Error]:", error);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
