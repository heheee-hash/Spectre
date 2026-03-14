import { UserRole } from "./roles";
import { Permission, rolePermissions } from "./permissions";

export function can(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  return permissions ? permissions.includes(permission) : false;
}
