"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for toasts, or I'll implement a simple alert

interface DetailActionsProps {
    id: string;
    type: "receipt" | "delivery" | "transfer" | "adjustment";
    status: string;
    isManager: boolean;
}

export function DetailActions({ id, type, status, isManager }: DetailActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateStatus = async (newStatus: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/${type}s/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            toast.success(`${type} marked as ${newStatus.toLowerCase()}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleValidate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/${type}s/${id}/validate`, {
                method: "POST",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Validation failed");
            }

            toast.success(`${type} validated and stock updated`);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "An error occurred during validation");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "DONE" || status === "CANCELED") {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            {status === "DRAFT" && (
                <Button 
                    variant="secondary" 
                    onClick={() => handleUpdateStatus("READY")}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                    Mark as Ready
                </Button>
            )}

            {(status === "READY" || (status === "WAITING" && type === "delivery")) && (
                <Button 
                    variant="default" 
                    onClick={handleValidate}
                    disabled={isLoading || !isManager}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Validate & Close
                </Button>
            )}

            {!isManager && status === "READY" && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Waiting for Manager approval
                </p>
            )}
        </div>
    );
}
