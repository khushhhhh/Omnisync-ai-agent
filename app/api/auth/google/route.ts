import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-auth";

export async function GET(request: Request) {
  try {
    const authUrl = getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initiate Google Auth.";
    console.error("[Google Auth Redirect Error]:", error);
    const url = new URL(request.url);
    url.pathname = "/dashboard";
    url.searchParams.set("error", "gmail_credentials_missing");
    return NextResponse.redirect(url);
  }
}
