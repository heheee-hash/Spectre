import { ProductForm } from "@/components/products/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Product | Core Inventory",
    description: "Edit an existing product",
};

export default function EditProductPage({ params }: { params: { productId: string } }) {
    // In a real app we'd fetch this data using params.productId
    const dummyData = {
        id: params.productId,
        name: "Wireless Keyboard",
        sku: "KB-WR-01",
        category: "Electronics",
        price: 45.99,
    };

    return <ProductForm initialData={dummyData} />;
}
