"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, MoreHorizontal, FileEdit, Trash2, Eye, Search, SlidersHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const dummyProducts = [
    { id: "PRD-001", name: "Wireless Keyboard", sku: "KB-WR-01", category: "Electronics", price: 45.99, stock: 120, status: "active" },
    { id: "PRD-045", name: "USB-C Hub", sku: "HB-USBC-45", category: "Accessories", price: 29.99, stock: 45, status: "active" },
    { id: "PRD-102", name: "Ergonomic Mouse", sku: "MS-ERG-02", category: "Electronics", price: 59.99, stock: 8, status: "low_stock" },
    { id: "PRD-219", name: "27-inch Monitor", sku: "MN-27-4K", category: "Displays", price: 349.00, stock: 25, status: "active" },
    { id: "PRD-330", name: "Mechanical Switches (Red)", sku: "SW-MEC-R", category: "Components", price: 15.50, stock: 0, status: "out_of_stock" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    active: {
        label: "Active",
        className: "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/15",
    },
    low_stock: {
        label: "Low Stock",
        className: "bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/15",
    },
    out_of_stock: {
        label: "Out of Stock",
        className: "bg-rose-500/10 text-rose-700 border-rose-200 hover:bg-rose-500/15",
    },
};

export function ProductTable() {
    const { data: session } = useSession();
    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const [search, setSearch] = useState("");

    const filteredProducts = dummyProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 bg-background"
                    />
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 shrink-0">
                                            <Package className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{product.name}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">{product.category}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-semibold text-foreground">${product.price.toFixed(2)}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={`text-sm font-mono font-semibold ${product.stock === 0 ? "text-rose-600" : product.stock < 10 ? "text-amber-600" : "text-foreground"}`}>
                                        {product.stock.toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-xs font-medium ${statusConfig[product.status]?.className}`}>
                                        {statusConfig[product.status]?.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Actions</p>
                                            <Link href={`/products/${product.id}`} className="block">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href={`/products/${product.id}/edit`} className="block">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <FileEdit className="mr-2 h-3.5 w-3.5" /> Edit Product
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem variant="destructive" className="cursor-pointer">
                                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Package className="h-8 w-8 opacity-30" />
                                        <p className="text-sm">No products found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* Table footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                        Showing <span className="font-semibold">{filteredProducts.length}</span> of{" "}
                        <span className="font-semibold">{dummyProducts.length}</span> products
                    </p>
                </div>
            </div>
        </div>
    );
}
