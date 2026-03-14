import { PageTitle } from "@/components/common/page-title";
import { LocationTable } from "@/components/warehouses/location-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { LocationService } from "@/server/services/warehouse.service";

export const metadata: Metadata = {
    title: "Locations | Core Inventory",
    description: "Manage specific inventory locations",
};

const locationService = new LocationService();

export default async function LocationsPage() {
    const locations = await locationService.getLocations();

    return (
        <div className="space-y-6">
            <PageTitle
                title="Locations"
                description="Manage shelves, racks, and rooms within your warehouses."
                action={
                    <Link 
                        href="/locations/new" 
                        className={cn(buttonVariants({ variant: "default" }), "flex items-center gap-2")}
                    >
                        <Plus className="h-4 w-4" />
                        Add Location
                    </Link>
                }
            />
            <LocationTable data={locations} />
        </div>
    );
}
