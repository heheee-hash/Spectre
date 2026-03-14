import { useAuth } from "@/context/AuthContext";
import { Permission } from "@/lib/auth/permissions";
import { can as verifyPermission } from "@/lib/auth/can";

export function usePermission() {
  const { userRole } = useAuth();

  const can = (permission: Permission): boolean => {
    if (!userRole) return false;
    return verifyPermission(userRole, permission);
  };

  return { can };
}
