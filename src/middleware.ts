import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

// next.js middleware - runs on every matched route
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // match all routes except static files and api
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
