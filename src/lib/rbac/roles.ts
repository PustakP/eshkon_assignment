import type { Role } from "@/types";

// role hierarchy - higher index = more privileges
export const ROLE_HIERARCHY: Role[] = [
  "viewer",
  "editor",
  "admin",
  "super_admin",
];

// get numeric level for comparison
export function getRoleLevel(role: Role): number {
  return ROLE_HIERARCHY.indexOf(role);
}

// check if role a >= role b in hierarchy
export function isRoleAtLeast(role: Role, minimum: Role): boolean {
  return getRoleLevel(role) >= getRoleLevel(minimum);
}

// roles that a given role can manage (only lower roles)
export function getManageableRoles(role: Role): Role[] {
  const level = getRoleLevel(role);
  return ROLE_HIERARCHY.filter((_, i) => i < level);
}
