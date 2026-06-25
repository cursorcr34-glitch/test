import type { Role } from "@rentacar/db";

export type Permission =
  | "car:read"
  | "car:manage"
  | "location:read"
  | "location:manage"
  | "category:read"
  | "category:manage"
  | "addon:read"
  | "addon:manage"
  | "booking:create"
  | "booking:read:own"
  | "booking:read:any"
  | "booking:update:any"
  | "booking:cancel:own"
  | "booking:cancel:any"
  | "payment:process"
  | "user:manage";

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  CUSTOMER: [
    "car:read",
    "location:read",
    "category:read",
    "addon:read",
    "booking:create",
    "booking:read:own",
    "booking:cancel:own",
    "payment:process",
  ],
  STAFF: [
    "car:read",
    "car:manage",
    "location:read",
    "location:manage",
    "category:read",
    "addon:read",
    "booking:read:any",
    "booking:update:any",
    "booking:cancel:any",
    "payment:process",
  ],
  ADMIN: [
    "car:read",
    "car:manage",
    "location:read",
    "location:manage",
    "category:read",
    "category:manage",
    "addon:read",
    "addon:manage",
    "booking:create",
    "booking:read:own",
    "booking:read:any",
    "booking:update:any",
    "booking:cancel:own",
    "booking:cancel:any",
    "payment:process",
    "user:manage",
  ],
};

const ROLE_HIERARCHY: Record<Role, number> = {
  CUSTOMER: 1,
  STAFF: 2,
  ADMIN: 3,
};

export const REGISTERABLE_ROLES: Role[] = ["CUSTOMER"];

export function getPermissions(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(
  role: Role,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: Role,
  permissions: Permission[],
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function hasAnyRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function canRegisterAs(role: Role): boolean {
  return REGISTERABLE_ROLES.includes(role);
}
