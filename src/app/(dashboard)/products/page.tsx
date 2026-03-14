import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PageTitle } from "@/components/common/page-title";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Products | Core Inventory",
    description: "Manage your product catalog",
};

export default async function ProductsPage() {
    return (
        <div className="space-y-6">
            <PageTitle
                title="Products"
                description="Manage your product catalog, prices, and settings."
                action={
                    <Button >
                        <Link href="/products/new" className="flex h-full w-full items-center justify-center gap-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                }
            />
            <ProductTable />
        </div>
    );
}
