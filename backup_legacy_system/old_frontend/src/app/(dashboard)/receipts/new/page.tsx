import { ReceiptForm } from "@/components/receipts/receipt-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Receipt | Core Inventory",
    description: "Create a new incoming receipt",
};

export default function NewReceiptPage() {
    return <ReceiptForm />;
}
