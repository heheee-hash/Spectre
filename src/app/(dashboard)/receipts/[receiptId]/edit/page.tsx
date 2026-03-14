import { ReceiptForm } from "@/components/receipts/receipt-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Receipt | Core Inventory",
    description: "Edit an existing receipt",
};

export default function EditReceiptPage({ params }: { params: { receiptId: string } }) {
    // In a real app we'd fetch this data using params.receiptId
    const dummyData = {
        id: params.receiptId,
        supplier: "TechParts Inc.",
        reference: "PO-2023-089",
        destinationId: "WH-Main",
        items: [
            { productId: "PRD-001", quantity: 50 },
            { productId: "PRD-045", quantity: 20 },
        ],
    };

    return <ReceiptForm initialData={dummyData} />;
}
