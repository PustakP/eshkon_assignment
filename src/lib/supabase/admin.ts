import { createClient } from "@supabase/supabase-js";

// admin client - bypasses rls, use only in server actions
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
