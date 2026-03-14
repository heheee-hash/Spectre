"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MoreHorizontal, FileEdit, Eye, Trash2, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TransferTableProps {
    data: any[];
}

export function TransferTable({ data }: TransferTableProps) {
    const { data: session } = useSession();
    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const [search, setSearch] = useState("");

    const filteredTransfers = data.filter((trn) =>
        trn.id.toLowerCase().includes(search.toLowerCase()) ||
        trn.reference.toLowerCase().includes(search.toLowerCase()) ||
        (trn.source?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (trn.destination?.name || "").toLowerCase().includes(search.toLowerCase())
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
                    placeholder="Search transfers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transfer ID</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransfers.map((trn) => (
                            <TableRow key={trn.id}>
                                <TableCell className="font-medium font-mono text-primary">{trn.id.substring(0, 8)}</TableCell>
                                <TableCell>{trn.reference}</TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm gap-2">
                                        <span className="truncate max-w-[120px]">{trn.source?.name || "N/A"}</span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="truncate max-w-[120px]">{trn.destination?.name || "N/A"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(trn.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={`capitalize ${getStatusColor(trn.status)}`}>
                                        {trn.status.toLowerCase()}
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
                                                <Link href={`/transfers/${trn.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                                            </DropdownMenuItem>
                                            {isManager && trn.status !== "DONE" && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/transfers/${trn.id}/edit`}><FileEdit className="mr-2 h-4 w-4" /> Edit Transfer</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancel</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTransfers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No transfers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
