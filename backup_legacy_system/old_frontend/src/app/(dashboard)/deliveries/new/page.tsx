import { DeliveryForm } from "@/components/deliveries/delivery-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Delivery | Core Inventory",
    description: "Create a new outgoing delivery",
};

export default function NewDeliveryPage() {
    return <DeliveryForm />;
}
