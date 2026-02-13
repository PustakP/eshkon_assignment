import type { Role } from "@/types";
import { isRoleAtLeast } from "./roles";

// all possible actions in the system
export type Action =
  | "page:view_published"
  | "page:create"
  | "page:edit"
  | "page:preview"
  | "page:publish"
  | "page:unpublish"
  | "page:delete"
  | "user:list"
  | "user:manage_editors"
  | "user:manage_admins"
  | "settings:view"
  | "settings:edit";

// min role required for each action
const PERMISSION_MAP: Record<Action, Role> = {
  "page:view_published": "viewer",
  "page:create": "editor",
  "page:edit": "editor",
  "page:preview": "editor",
  "page:publish": "admin",
  "page:unpublish": "admin",
  "page:delete": "admin",
  "user:list": "admin",
  "user:manage_editors": "admin",
  "user:manage_admins": "super_admin",
  "settings:view": "super_admin",
  "settings:edit": "super_admin",
};

// check if a role can perform an action
export function canPerform(role: Role, action: Action): boolean {
  const required = PERMISSION_MAP[action];
  return isRoleAtLeast(role, required);
}

// get all actions a role can perform
export function getAllowedActions(role: Role): Action[] {
  return (Object.keys(PERMISSION_MAP) as Action[]).filter((action) =>
    canPerform(role, action)
  );
}
