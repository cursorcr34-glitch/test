import type { UserRole } from "@emlak/db";

export type Permission =
  | "property:read"
  | "property:create"
  | "property:update:own"
  | "property:update:any"
  | "property:delete:own"
  | "property:delete:any"
  | "inquiry:create"
  | "inquiry:read:own"
  | "inquiry:read:assigned"
  | "inquiry:read:any"
  | "inquiry:update:assigned"
  | "inquiry:update:any"
  | "favorite:manage"
  | "agent:profile:manage"
  | "agent:manage"
  | "analytics:read"
  | "user:manage";

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  BUYER: [
    "property:read",
    "inquiry:create",
    "inquiry:read:own",
    "favorite:manage",
  ],
  SELLER: [
    "property:read",
    "property:create",
    "property:update:own",
    "property:delete:own",
    "inquiry:create",
    "inquiry:read:own",
    "favorite:manage",
  ],
  AGENT: [
    "property:read",
    "property:create",
    "property:update:own",
    "property:delete:own",
    "inquiry:create",
    "inquiry:read:own",
    "inquiry:read:assigned",
    "inquiry:update:assigned",
    "favorite:manage",
    "agent:profile:manage",
    "analytics:read",
  ],
  ADMIN: [
    "property:read",
    "property:create",
    "property:update:own",
    "property:update:any",
    "property:delete:own",
    "property:delete:any",
    "inquiry:create",
    "inquiry:read:own",
    "inquiry:read:assigned",
    "inquiry:read:any",
    "inquiry:update:assigned",
    "inquiry:update:any",
    "favorite:manage",
    "agent:profile:manage",
    "agent:manage",
    "analytics:read",
    "user:manage",
  ],
};

const ROLE_HIERARCHY: Record<UserRole, number> = {
  BUYER: 1,
  SELLER: 2,
  AGENT: 3,
  ADMIN: 4,
};

export const REGISTERABLE_ROLES: UserRole[] = ["BUYER", "SELLER", "AGENT"];

export function getPermissions(role: UserRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function hasAnyRole(
  userRole: UserRole,
  allowedRoles: UserRole[],
): boolean {
  return allowedRoles.includes(userRole);
}

export function canRegisterAs(role: UserRole): boolean {
  return REGISTERABLE_ROLES.includes(role);
}
