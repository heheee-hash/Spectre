import { CategoryForm } from "@/components/products/category-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Category | Core Inventory",
    description: "Edit an existing product category",
};

export default function EditCategoryPage({ params }: { params: { categoryId: string } }) {
    // In a real app we'd fetch this data using params.categoryId
    const dummyData = {
        id: params.categoryId,
        name: "Electronics",
        description: "Devices and gadgets",
    };

    return <CategoryForm initialData={dummyData} />;
}
