import { DeliveryForm } from "@/components/deliveries/delivery-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Delivery | Core Inventory",
    description: "Edit an existing delivery",
};

export default function EditDeliveryPage({ params }: { params: { deliveryId: string } }) {
    // In a real app we'd fetch this data using params.deliveryId
    const dummyData = {
        id: params.deliveryId,
        customer: "Acme Corp",
        reference: "SO-2023-102",
        sourceId: "WH-Main",
        items: [
            { productId: "PRD-219", quantity: 2 },
        ],
    };

    return <DeliveryForm initialData={dummyData} />;
}
