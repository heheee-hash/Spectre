import { AdjustmentForm } from "@/components/adjustments/adjustment-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Adjustment | Core Inventory",
    description: "Edit an existing adjustment",
};

export default function EditAdjustmentPage({ params }: { params: { adjustmentId: string } }) {
    // In a real app we'd fetch this data using params.adjustmentId
    const dummyData = {
        id: params.adjustmentId,
        reason: "Damaged goods write-off",
        locationId: "WH-East",
        notes: "Forklift accident in aisle 3",
        items: [
            { productId: "PRD-102", countedQuantity: 0 },
        ],
    };

    return <AdjustmentForm initialData={dummyData} />;
}
