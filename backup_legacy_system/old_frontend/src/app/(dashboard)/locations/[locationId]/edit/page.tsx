import { LocationForm } from "@/components/warehouses/location-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Location | Core Inventory",
    description: "Edit an existing inventory location",
};

export default function EditLocationPage({ params }: { params: { locationId: string } }) {
    // In a real app we'd fetch this data using params.locationId
    const dummyData = {
        id: params.locationId,
        name: "Shelf A1",
        code: "WH1-A1",
        warehouseId: "WH-Main",
        type: "shelf",
    };

    return <LocationForm initialData={dummyData} />;
}
