import { describe, it, expect } from "vitest";
import { canPerform, getAllowedActions, type Action } from "./permissions";
import { isRoleAtLeast, getRoleLevel, getManageableRoles } from "./roles";
import type { Role } from "@/types";

// all actions for exhaustive testing
const ALL_ACTIONS: Action[] = [
  "page:view_published",
  "page:create",
  "page:edit",
  "page:preview",
  "page:publish",
  "page:unpublish",
  "page:delete",
  "user:list",
  "user:manage_editors",
  "user:manage_admins",
  "settings:view",
  "settings:edit",
];

describe("role hierarchy", () => {
  it("should rank roles correctly", () => {
    expect(getRoleLevel("viewer")).toBe(0);
    expect(getRoleLevel("editor")).toBe(1);
    expect(getRoleLevel("admin")).toBe(2);
    expect(getRoleLevel("super_admin")).toBe(3);
  });

  it("isRoleAtLeast should compare correctly", () => {
    expect(isRoleAtLeast("super_admin", "viewer")).toBe(true);
    expect(isRoleAtLeast("admin", "editor")).toBe(true);
    expect(isRoleAtLeast("editor", "admin")).toBe(false);
    expect(isRoleAtLeast("viewer", "viewer")).toBe(true);
  });

  it("getManageableRoles returns lower roles only", () => {
    expect(getManageableRoles("super_admin")).toEqual(["viewer", "editor", "admin"]);
    expect(getManageableRoles("admin")).toEqual(["viewer", "editor"]);
    expect(getManageableRoles("editor")).toEqual(["viewer"]);
    expect(getManageableRoles("viewer")).toEqual([]);
  });
});

describe("canPerform - viewer", () => {
  const role: Role = "viewer";

  it("can view published pages", () => {
    expect(canPerform(role, "page:view_published")).toBe(true);
  });

  it("cannot create, edit, preview, publish, or delete pages", () => {
    expect(canPerform(role, "page:create")).toBe(false);
    expect(canPerform(role, "page:edit")).toBe(false);
    expect(canPerform(role, "page:preview")).toBe(false);
    expect(canPerform(role, "page:publish")).toBe(false);
    expect(canPerform(role, "page:delete")).toBe(false);
  });

  it("cannot manage users or settings", () => {
    expect(canPerform(role, "user:list")).toBe(false);
    expect(canPerform(role, "user:manage_editors")).toBe(false);
    expect(canPerform(role, "user:manage_admins")).toBe(false);
    expect(canPerform(role, "settings:view")).toBe(false);
    expect(canPerform(role, "settings:edit")).toBe(false);
  });
});

describe("canPerform - editor", () => {
  const role: Role = "editor";

  it("can view, create, edit, and preview pages", () => {
    expect(canPerform(role, "page:view_published")).toBe(true);
    expect(canPerform(role, "page:create")).toBe(true);
    expect(canPerform(role, "page:edit")).toBe(true);
    expect(canPerform(role, "page:preview")).toBe(true);
  });

  it("cannot publish or delete pages", () => {
    expect(canPerform(role, "page:publish")).toBe(false);
    expect(canPerform(role, "page:unpublish")).toBe(false);
    expect(canPerform(role, "page:delete")).toBe(false);
  });

  it("cannot manage users or settings", () => {
    expect(canPerform(role, "user:list")).toBe(false);
    expect(canPerform(role, "settings:view")).toBe(false);
  });
});

describe("canPerform - admin", () => {
  const role: Role = "admin";

  it("can do everything an editor can", () => {
    expect(canPerform(role, "page:view_published")).toBe(true);
    expect(canPerform(role, "page:create")).toBe(true);
    expect(canPerform(role, "page:edit")).toBe(true);
    expect(canPerform(role, "page:preview")).toBe(true);
  });

  it("can publish, unpublish, and delete pages", () => {
    expect(canPerform(role, "page:publish")).toBe(true);
    expect(canPerform(role, "page:unpublish")).toBe(true);
    expect(canPerform(role, "page:delete")).toBe(true);
  });

  it("can manage editors but not admins", () => {
    expect(canPerform(role, "user:list")).toBe(true);
    expect(canPerform(role, "user:manage_editors")).toBe(true);
    expect(canPerform(role, "user:manage_admins")).toBe(false);
  });

  it("cannot access settings", () => {
    expect(canPerform(role, "settings:view")).toBe(false);
    expect(canPerform(role, "settings:edit")).toBe(false);
  });
});

describe("canPerform - super_admin", () => {
  const role: Role = "super_admin";

  it("can perform every action", () => {
    ALL_ACTIONS.forEach((action) => {
      expect(canPerform(role, action)).toBe(true);
    });
  });
});

describe("getAllowedActions", () => {
  it("viewer gets only 1 action", () => {
    expect(getAllowedActions("viewer")).toEqual(["page:view_published"]);
  });

  it("super_admin gets all actions", () => {
    expect(getAllowedActions("super_admin")).toEqual(ALL_ACTIONS);
  });

  it("editor actions are subset of admin actions", () => {
    const editorActions = getAllowedActions("editor");
    const adminActions = getAllowedActions("admin");
    editorActions.forEach((a) => expect(adminActions).toContain(a));
  });
});
