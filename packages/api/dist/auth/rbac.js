"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTERABLE_ROLES = void 0;
exports.getPermissions = getPermissions;
exports.hasPermission = hasPermission;
exports.hasAnyPermission = hasAnyPermission;
exports.hasAllPermissions = hasAllPermissions;
exports.hasRole = hasRole;
exports.hasAnyRole = hasAnyRole;
exports.canRegisterAs = canRegisterAs;
const ROLE_PERMISSIONS = {
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
const ROLE_HIERARCHY = {
    BUYER: 1,
    SELLER: 2,
    AGENT: 3,
    ADMIN: 4,
};
exports.REGISTERABLE_ROLES = ["BUYER", "SELLER", "AGENT"];
function getPermissions(role) {
    return ROLE_PERMISSIONS[role];
}
function hasPermission(role, permission) {
    return ROLE_PERMISSIONS[role].includes(permission);
}
function hasAnyPermission(role, permissions) {
    return permissions.some((p) => hasPermission(role, p));
}
function hasAllPermissions(role, permissions) {
    return permissions.every((p) => hasPermission(role, p));
}
function hasRole(userRole, requiredRole) {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
function hasAnyRole(userRole, allowedRoles) {
    return allowedRoles.includes(userRole);
}
function canRegisterAs(role) {
    return exports.REGISTERABLE_ROLES.includes(role);
}
//# sourceMappingURL=rbac.js.map