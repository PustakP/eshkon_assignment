import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canPerform } from "@/lib/rbac/permissions";
import type { Profile } from "@/types";

// settings page (super_admin only) - placeholder
export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");
  const typedProfile = profile as Profile;

  // server-side permission gate
  if (!canPerform(typedProfile.role, "settings:view")) {
    redirect("/pages");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">System Settings</h1>
      <div className="bg-surface border border-beige-dark p-8">
        <p className="text-muted">
          System-wide configuration. Only super admins can access this page.
        </p>
        <div className="mt-6 space-y-4">
          <div className="border-b border-beige-dark pb-4">
            <h2 className="font-semibold">Application</h2>
            <p className="text-sm text-muted mt-1">Eshkon Page Builder v0.1.0</p>
          </div>
          <div className="border-b border-beige-dark pb-4">
            <h2 className="font-semibold">Environment</h2>
            <p className="text-sm text-muted mt-1">
              {process.env.NODE_ENV ?? "development"}
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Your Role</h2>
            <span className="mt-1 inline-block bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-dark">
              {typedProfile.role.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
