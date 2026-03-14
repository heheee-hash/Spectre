import { TransferForm } from "@/components/transfers/transfer-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Transfer | Core Inventory",
    description: "Create a new internal stock transfer",
};

export default function NewTransferPage() {
    return <TransferForm />;
}
