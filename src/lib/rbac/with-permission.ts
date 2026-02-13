import type { Profile } from "@/types";
import type { Action } from "./permissions";
import { canPerform } from "./permissions";
import { createServerSupabase } from "@/lib/supabase/server";

// fetch authenticated user profile from supabase (server-only)
export async function getAuthProfile(): Promise<Profile> {
  const supabase = await createServerSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("profile not found");
  }

  return profile as Profile;
}

// hof - wraps server actions w/ permission check
// not "use server" itself - the calling file must be
export function withPermission<TArgs extends unknown[], TReturn>(
  action: Action,
  fn: (profile: Profile, ...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs) => {
    const profile = await getAuthProfile();

    if (!canPerform(profile.role, action)) {
      throw new Error("forbidden: insufficient permissions");
    }

    return fn(profile, ...args);
  };
}
