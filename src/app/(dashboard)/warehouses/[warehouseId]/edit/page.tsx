import { WarehouseForm } from "@/components/warehouses/warehouse-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Warehouse | Core Inventory",
    description: "Edit an existing warehouse",
};

export default function EditWarehousePage({ params }: { params: { warehouseId: string } }) {
    // In a real app we'd fetch this data using params.warehouseId
    const dummyData = {
        id: params.warehouseId,
        name: "Main HQ Warehouse",
        code: "WH-01",
        address: "123 Inventory St, Tech City",
    };

    return <WarehouseForm initialData={dummyData} />;
}
