import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function requireAuth(): Promise<{ id: string; role: string; name?: string | null; email?: string | null }> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  
  return session.user as any;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  
  return user;
}

export function apiHandler(handler: (req: Request, context: any) => Promise<NextResponse>) {
  return async (req: Request, context: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error("API Error:", error);
      
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ message: "Forbidden: Insufficient permissions" }, { status: 403 });
      }

      if (error.name === "ZodError") {
        return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
      }

      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
}
