import { PageTitle } from "@/components/common/page-title";
import { WarehouseTable } from "@/components/warehouses/warehouse-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { WarehouseService } from "@/server/services/warehouse.service";

export const metadata: Metadata = {
    title: "Warehouses | Core Inventory",
    description: "Manage your warehouses",
};

const warehouseService = new WarehouseService();

export default async function WarehousesPage() {
    const warehouses = await warehouseService.getWarehouses();

    return (
        <div className="space-y-6">
            <PageTitle
                title="Warehouses"
                description="Manage your main facilities where stock is stored."
                action={
                    <Link 
                        href="/warehouses/new" 
                        className={cn(buttonVariants({ variant: "default" }), "flex items-center gap-2")}
                    >
                        <Plus className="h-4 w-4" />
                        Add Warehouse
                    </Link>
                }
            />
            <WarehouseTable data={warehouses} />
        </div>
    );
}
