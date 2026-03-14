import { WarehouseForm } from "@/components/warehouses/warehouse-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Warehouse | Core Inventory",
    description: "Create a new warehouse",
};

export default function NewWarehousePage() {
    return <WarehouseForm />;
}
