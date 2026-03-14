"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MoreHorizontal, FileEdit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const dummyCategories = [
    { id: "CAT-1", name: "Electronics", description: "Devices and gadgets", productCount: 45 },
    { id: "CAT-2", name: "Accessories", description: "Cables, hubs, and peripherals", productCount: 120 },
    { id: "CAT-3", name: "Displays", description: "Monitors and screens", productCount: 15 },
    { id: "CAT-4", name: "Components", description: "Internal computer parts like switches", productCount: 85 },
];

export function CategoryTable() {
    const { data: session } = useSession();
    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const [search, setSearch] = useState("");

    const filteredCategories = dummyCategories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Products</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="text-muted-foreground">{category.description}</TableCell>
                                <TableCell className="text-right font-mono">{category.productCount}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Actions</p>
                                            <DropdownMenuItem>
                                                {isManager && (
                                                <Link href={`/categories/${category.id}/edit`}><FileEdit className="mr-2 h-4 w-4" /> Edit Category</Link>
                                            )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
