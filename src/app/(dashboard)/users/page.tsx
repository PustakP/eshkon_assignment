import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canPerform } from "@/lib/rbac/permissions";
import { getManageableRoles } from "@/lib/rbac/roles";
import type { Profile } from "@/types";
import { UserRoleSelect } from "@/components/ui/user-role-select";

// user management page (admin+)
export default async function UsersPage() {
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
  if (!canPerform(typedProfile.role, "user:list")) {
    redirect("/pages");
  }

  // fetch all users
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const typedUsers = (users ?? []) as Profile[];
  const manageableRoles = getManageableRoles(typedProfile.role);
  const canManageAdmins = canPerform(typedProfile.role, "user:manage_admins");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-beige-dark bg-surface text-sm">
          <thead>
            <tr className="border-b border-beige-dark bg-beige text-left">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Joined</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {typedUsers.map((u) => {
              const isSelf = u.id === typedProfile.id;
              // can only change roles of users below you
              const canChange =
                !isSelf &&
                (canManageAdmins ||
                  manageableRoles.includes(u.role));

              return (
                <tr key={u.id} className="border-b border-beige-dark">
                  <td className="px-4 py-2">
                    {u.full_name || "—"}
                    {isSelf && (
                      <span className="ml-1 text-xs text-muted">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-muted">{u.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium ${
                        u.role === "super_admin"
                          ? "bg-brand-light text-brand-dark"
                          : u.role === "admin"
                          ? "bg-mint text-gray-700"
                          : u.role === "editor"
                          ? "bg-beige text-gray-600"
                          : "bg-gray-100 text-muted"
                      }`}
                    >
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {canChange ? (
                      <UserRoleSelect
                        userId={u.id}
                        currentRole={u.role}
                        actorRole={typedProfile.role}
                      />
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
