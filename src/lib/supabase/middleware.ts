import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// session cookie name - no maxAge so it dies when browser closes
const SESSION_COOKIE = "__session_alive";

// refresh supabase auth token in middleware
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // skip if env vars missing (build time)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refresh session - important for server components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);

  // stale session: user has supabase auth but browser session expired
  // sign out and redirect to login
  if (user && !hasSessionCookie) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // redirect unauthed users away from dashboard
  const isDashboard = request.nextUrl.pathname.startsWith("/pages") ||
    request.nextUrl.pathname.startsWith("/users") ||
    request.nextUrl.pathname.startsWith("/settings");

  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // redirect authed users away from auth pages
  const isAuth = request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (user && isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/pages";
    return NextResponse.redirect(url);
  }

  // keep session cookie alive for active sessions (no maxAge = session cookie)
  if (user && hasSessionCookie) {
    supabaseResponse.cookies.set(SESSION_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // no maxAge/expires → browser session cookie
    });
  }

  return supabaseResponse;
}
