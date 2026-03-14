"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MoreHorizontal, FileEdit, Eye, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdjustmentTableProps {
    data: any[];
}

export function AdjustmentTable({ data }: AdjustmentTableProps) {
    const { data: session } = useSession();
    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const [search, setSearch] = useState("");

    const filteredAdjustments = data.filter((adj) =>
        adj.id.toLowerCase().includes(search.toLowerCase()) ||
        adj.reason.toLowerCase().includes(search.toLowerCase()) ||
        (adj.location?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case "applied": return "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20";
            case "draft": return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search adjustments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Adjustment ID</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAdjustments.map((adj) => (
                            <TableRow key={adj.id}>
                                <TableCell className="font-medium font-mono text-primary">{adj.id.substring(0, 8)}</TableCell>
                                <TableCell>{adj.reason}</TableCell>
                                <TableCell>{adj.location?.name || "N/A"}</TableCell>
                                <TableCell>{new Date(adj.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={`capitalize ${getStatusColor(adj.status)}`}>
                                        {adj.status.toLowerCase()}
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
                                                <Link href={`/adjustments/${adj.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                                            </DropdownMenuItem>
                                            {isManager && adj.status !== "APPLIED" && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/adjustments/${adj.id}/edit`}><FileEdit className="mr-2 h-4 w-4" /> Edit</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancel</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredAdjustments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No adjustments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
