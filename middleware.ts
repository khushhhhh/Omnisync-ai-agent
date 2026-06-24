import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  /*
  // SERVER-SIDE MIDDLEWARE AUTH CHECK (COMMENTED OUT FOR UI SPRINT)
  // This allows the dashboard to render 100% statically and unblocks UI testing.
  
  const { updateSession } = await import("@insforge/sdk/ssr/middleware");
  type CookieStore = import("@insforge/sdk/ssr/middleware").CookieStore;

  await updateSession({
    requestCookies: request.cookies as unknown as CookieStore,
    responseCookies: response.cookies as unknown as CookieStore,
  });

  const path = request.nextUrl.pathname;
  if (path.startsWith("/dashboard")) {
    const hasAccessToken = request.cookies.has("insforge_access_token") || response.cookies.has("insforge_access_token");
    if (!hasAccessToken) {
      const redirectUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  */

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
