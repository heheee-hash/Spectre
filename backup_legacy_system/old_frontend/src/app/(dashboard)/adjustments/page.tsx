import { PageTitle } from "@/components/common/page-title";
import { AdjustmentTable } from "@/components/adjustments/adjustment-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { AdjustmentService } from "@/server/services/adjustment.service";

export const metadata: Metadata = {
    title: "Adjustments | Core Inventory",
    description: "Manage inventory adjustments",
};

const adjustmentService = new AdjustmentService();

export default async function AdjustmentsPage() {
    const adjustments = await adjustmentService.getAdjustments();

    return (
        <div className="space-y-6">
            <PageTitle
                title="Inventory Adjustments"
                description="Reconcile physical stock counts and correct errors."
                action={
                    <Link 
                        href="/adjustments/new" 
                        className={cn(buttonVariants({ variant: "default" }), "flex items-center gap-2")}
                    >
                        <Plus className="h-4 w-4" />
                        New Adjustment
                    </Link>
                }
            />
            <AdjustmentTable data={adjustments} />
        </div>
    );
}
