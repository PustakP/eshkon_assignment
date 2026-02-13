"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { Profile } from "@/types";

// topbar w/ user info + logout
export function Topbar({ profile }: { profile: Profile }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    // clear session cookie on explicit logout
    document.cookie = "__session_alive=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-beige-dark bg-surface px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">
          {profile.full_name || profile.email}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1 text-sm text-muted hover:text-brand"
          title="Sign out"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
