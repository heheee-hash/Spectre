import { PageTitle } from "@/components/common/page-title";
import { ReceiptTable } from "@/components/receipts/receipt-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ReceiptService } from "@/server/services/receipt.service";

export const metadata: Metadata = {
    title: "Receipts | Core Inventory",
    description: "Manage incoming stock receipts",
};

const receiptService = new ReceiptService();

export default async function ReceiptsPage() {
    const receipts = await receiptService.getReceipts();

    return (
        <div className="space-y-6">
            <PageTitle
                title="Incoming Receipts"
                description="Manage incoming stock from vendors and suppliers."
                action={
                    <Link 
                        href="/receipts/new" 
                        className={cn(buttonVariants({ variant: "default" }), "flex items-center gap-2")}
                    >
                        <Plus className="h-4 w-4" />
                        New Receipt
                    </Link>
                }
            />
            <ReceiptTable data={receipts} />
        </div>
    );
}
