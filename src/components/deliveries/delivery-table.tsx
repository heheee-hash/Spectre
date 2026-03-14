"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MoreHorizontal, FileEdit, Eye, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DeliveryTableProps {
    data: any[];
}

export function DeliveryTable({ data }: DeliveryTableProps) {
    const { data: session } = useSession();
    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const [search, setSearch] = useState("");

    const filteredDeliveries = data.filter((del) =>
        del.id.toLowerCase().includes(search.toLowerCase()) ||
        del.reference.toLowerCase().includes(search.toLowerCase()) ||
        (del.customerName || "").toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case "done": return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20";
            case "ready": return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
            case "waiting": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
            case "draft": return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search deliveries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Delivery ID</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDeliveries.map((del) => (
                            <TableRow key={del.id}>
                                <TableCell className="font-medium font-mono text-primary">{del.id.substring(0, 8)}</TableCell>
                                <TableCell>{del.reference}</TableCell>
                                <TableCell>{del.customerName || "N/A"}</TableCell>
                                <TableCell>{new Date(del.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={`capitalize ${getStatusColor(del.status)}`}>
                                        {del.status.toLowerCase()}
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
                                                <Link href={`/deliveries/${del.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                                            </DropdownMenuItem>
                                            {isManager && del.status !== "DONE" && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/deliveries/${del.id}/edit`}><FileEdit className="mr-2 h-4 w-4" /> Edit Delivery</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancel</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredDeliveries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No deliveries found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
