import { AdjustmentForm } from "@/components/adjustments/adjustment-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Adjustment | Core Inventory",
    description: "Create a new inventory adjustment",
};

export default function NewAdjustmentPage() {
    return <AdjustmentForm />;
}
