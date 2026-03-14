import { PageTitle } from "@/components/common/page-title";
import { MoveHistoryTable } from "@/components/history/move-history-table";
import type { Metadata } from "next";
import { LedgerService } from "@/server/services/ledger.service";

export const metadata: Metadata = {
    title: "Move History | Core Inventory",
    description: "View historical inventory movements",
};

const ledgerService = new LedgerService();

export default async function MoveHistoryPage() {
    const moves = await ledgerService.getMoveHistory();

    return (
        <div className="space-y-6">
            <PageTitle
                title="Move History"
                description="Comprehensive ledger of all stock movements across your warehouses."
            />
            <MoveHistoryTable data={moves} />
        </div>
    );
}
