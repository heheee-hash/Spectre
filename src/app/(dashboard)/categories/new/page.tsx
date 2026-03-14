import { CategoryForm } from "@/components/products/category-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Category | Core Inventory",
    description: "Create a new product category",
};

export default function NewCategoryPage() {
    return <CategoryForm />;
}
