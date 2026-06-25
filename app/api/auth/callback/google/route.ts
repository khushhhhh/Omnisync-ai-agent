import { redirect } from "next/navigation";
import { getOAuthClient, saveTokens } from "@/lib/google-auth";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  let isSuccess = false;
  let errorMessage = "";

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      errorMessage = "Authorization code is missing.";
    } else {
      const oauth2Client = getOAuthClient();
      const { tokens } = await oauth2Client.getToken(code);
      
      // Save tokens to local secure session store
      saveTokens(tokens);

      // Save tokens to secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set("gmail_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      isSuccess = true;
    }
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : "Authentication callback failed.";
    console.error("[Google OAuth Callback Error]:", error);
  }

  if (isSuccess) {
    redirect("/dashboard?status=success");
  } else {
    redirect(`/dashboard?status=error&message=${encodeURIComponent(errorMessage)}`);
  }
}
