import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// oauth callback handler - exchanges code for session
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/pages";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // redirect to error page on failure
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
