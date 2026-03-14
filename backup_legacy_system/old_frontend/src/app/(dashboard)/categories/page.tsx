import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PageTitle } from "@/components/common/page-title";
import { CategoryTable } from "@/components/products/category-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories | Core Inventory",
    description: "Manage product categories",
};

export default async function CategoriesPage() {
    return (
        <div className="space-y-6">
            <PageTitle
                title="Categories"
                description="Organize your products into categories."
                action={
                    <Button >
                        <Link href="/categories/new" className="flex h-full w-full items-center justify-center gap-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Link>
                    </Button>
                }
            />
            <CategoryTable />
        </div>
    );
}
