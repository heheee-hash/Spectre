import { PageTitle } from "@/components/common/page-title";
import { DeliveryTable } from "@/components/deliveries/delivery-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { DeliveryService } from "@/server/services/delivery.service";

export const metadata: Metadata = {
    title: "Deliveries | Core Inventory",
    description: "Manage outgoing stock deliveries",
};

const deliveryService = new DeliveryService();

export default async function DeliveriesPage() {
    const deliveries = await deliveryService.getDeliveries();

    return (
        <div className="space-y-6">
            <PageTitle
                title="Outgoing Deliveries"
                description="Manage outbound orders shipping to customers."
                action={
                    <Link 
                        href="/deliveries/new" 
                        className={cn(buttonVariants({ variant: "default" }), "flex items-center gap-2")}
                    >
                        <Plus className="h-4 w-4" />
                        New Delivery
                    </Link>
                }
            />
            <DeliveryTable data={deliveries} />
        </div>
    );
}
