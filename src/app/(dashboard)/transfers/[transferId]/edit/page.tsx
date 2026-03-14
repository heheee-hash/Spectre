import { TransferForm } from "@/components/transfers/transfer-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Transfer | Core Inventory",
    description: "Edit an existing internal transfer",
};

export default function EditTransferPage({ params }: { params: { transferId: string } }) {
    // In a real app we'd fetch this data using params.transferId
    const dummyData = {
        id: params.transferId,
        reference: "INT-001",
        sourceId: "WH-Main",
        destinationId: "WH-East",
        items: [
            { productId: "PRD-219", quantity: 5 },
            { productId: "PRD-001", quantity: 20 },
        ],
    };

    return <TransferForm initialData={dummyData} />;
}
