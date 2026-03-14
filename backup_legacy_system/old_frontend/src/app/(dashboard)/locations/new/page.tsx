import { LocationForm } from "@/components/warehouses/location-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Location | Core Inventory",
    description: "Create a new inventory location",
};

export default function NewLocationPage() {
    return <LocationForm />;
}
