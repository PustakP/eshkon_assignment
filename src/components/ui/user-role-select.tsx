"use client";

import { useState } from "react";
import { changeUserRole } from "@/lib/actions/users";
import { getManageableRoles } from "@/lib/rbac/roles";
import { useRouter } from "next/navigation";
import type { Role } from "@/types";

type Props = {
  userId: string;
  currentRole: Role;
  actorRole: Role;
};

// role selector dropdown for user mgmt
export function UserRoleSelect({ userId, currentRole, actorRole }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // super_admin can assign any role, admin can only assign lower
  const assignableRoles =
    actorRole === "super_admin"
      ? (["viewer", "editor", "admin", "super_admin"] as Role[])
      : getManageableRoles(actorRole);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as Role;
    if (newRole === currentRole) return;

    setLoading(true);
    try {
      await changeUserRole(userId, newRole);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={loading}
      className="border border-beige-dark bg-beige px-2 py-1 text-xs focus:border-brand focus:outline-none disabled:opacity-50"
    >
      {assignableRoles.map((role) => (
        <option key={role} value={role}>
          {role.replace("_", " ")}
        </option>
      ))}
      {/* show current role even if not assignable */}
      {!assignableRoles.includes(currentRole) && (
        <option value={currentRole} disabled>
          {currentRole.replace("_", " ")}
        </option>
      )}
    </select>
  );
}
