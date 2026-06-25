import type { UserRole } from "@emlak/db";
export type Permission = "property:read" | "property:create" | "property:update:own" | "property:update:any" | "property:delete:own" | "property:delete:any" | "inquiry:create" | "inquiry:read:own" | "inquiry:read:assigned" | "inquiry:read:any" | "inquiry:update:assigned" | "inquiry:update:any" | "favorite:manage" | "agent:profile:manage" | "agent:manage" | "analytics:read" | "user:manage";
export declare const REGISTERABLE_ROLES: UserRole[];
export declare function getPermissions(role: UserRole): readonly Permission[];
export declare function hasPermission(role: UserRole, permission: Permission): boolean;
export declare function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean;
export declare function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean;
export declare function hasRole(userRole: UserRole, requiredRole: UserRole): boolean;
export declare function hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean;
export declare function canRegisterAs(role: UserRole): boolean;
//# sourceMappingURL=rbac.d.ts.map