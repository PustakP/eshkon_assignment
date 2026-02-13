"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { withPermission } from "@/lib/rbac/with-permission";
import { isRoleAtLeast } from "@/lib/rbac/roles";
import type { Profile, Role } from "@/types";
import { revalidatePath } from "next/cache";

// change a user's role (admin+ can change lower roles, sa can change any)
export const changeUserRole = withPermission(
  "user:manage_editors",
  async (actor: Profile, targetUserId: string, newRole: Role) => {
    // prevent self-role change
    if (actor.id === targetUserId) {
      throw new Error("cannot change own role");
    }

    // sa required to assign admin+ roles
    if (isRoleAtLeast(newRole, "admin") && actor.role !== "super_admin") {
      throw new Error("only super_admin can assign admin roles");
    }

    const admin = createAdminClient();

    // verify target exists and is lower in hierarchy
    const { data: target } = await admin
      .from("profiles")
      .select("role")
      .eq("id", targetUserId)
      .single();

    if (!target) throw new Error("user not found");

    // admin can only manage users below their level
    if (isRoleAtLeast(target.role as Role, actor.role)) {
      throw new Error("cannot manage user at or above your role");
    }

    const { error } = await admin
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetUserId);

    if (error) throw new Error(error.message);

    revalidatePath("/users");
    return { success: true };
  }
);
