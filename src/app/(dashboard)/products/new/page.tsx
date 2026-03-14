import { ProductForm } from "@/components/products/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Product | Core Inventory",
    description: "Create a new product",
};

export default function NewProductPage() {
    return <ProductForm />;
}
