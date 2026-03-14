'use client';

import { useAuth } from "@/context/AuthContext";
import { Permission } from "@/lib/auth/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: Permission;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, permission, fallback }: ProtectedRouteProps) {
  const { loading, currentUser } = useAuth();
  const { can } = usePermission();
  const router = useRouter();

  const hasPermission = permission ? can(permission) : true;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will be handled by layout redirect
  }

  if (!hasPermission) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          You do not have the necessary permissions to view this content. Please contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
