import { PageTitle } from "@/components/common/page-title";
import { TransferTable } from "@/components/transfers/transfer-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { TransferService } from "@/server/services/transfer.service";

export const metadata: Metadata = {
    title: "Transfers | Core Inventory",
    description: "Manage internal stock transfers",
};

const transferService = new TransferService();

export default async function TransfersPage() {
    const transfers = await transferService.getTransfers();

    return (
        <div className="space-y-6">
            <PageTitle
                title="Internal Transfers"
                description="Move stock between warehouse locations."
                action={
                    <Link 
                        href="/transfers/new" 
                        className={cn(buttonVariants({ variant: "default" }), "flex items-center gap-2")}
                    >
                        <Plus className="h-4 w-4" />
                        New Transfer
                    </Link>
                }
            />
            <TransferTable data={transfers} />
        </div>
    );
}
