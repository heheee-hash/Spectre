"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MoreHorizontal, FileEdit, Trash2, Box } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LocationTableProps {
    data: any[];
}

export function LocationTable({ data }: LocationTableProps) {
    const { data: session } = useSession();
    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const [search, setSearch] = useState("");

    const filteredLocations = data.filter((loc) =>
        loc.name.toLowerCase().includes(search.toLowerCase()) ||
        (loc.code || "").toLowerCase().includes(search.toLowerCase()) ||
        (loc.warehouse?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search locations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Location Details</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLocations.map((loc) => (
                            <TableRow key={loc.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{loc.name}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{loc.code || "N/A"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{loc.warehouse?.name || "N/A"}</TableCell>
                                <TableCell className="capitalize">
                                    <Badge variant="outline" className="font-normal">
                                        {loc.type.toLowerCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Actions</p>
                                            <DropdownMenuItem asChild>
                                                {isManager && (
                                                <Link href={`/locations/${loc.id}/edit`}><FileEdit className="mr-2 h-4 w-4" /> Edit</Link>
                                            )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredLocations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No locations found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
