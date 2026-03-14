"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDownRight, ArrowUpRight, RefreshCw, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoveHistoryTableProps {
    data: any[];
}

export function MoveHistoryTable({ data }: MoveHistoryTableProps) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const getDocumentLink = (type: string, id: string) => {
        const typeMap: Record<string, string> = {
            'RECEIPT': 'receipts',
            'DELIVERY': 'deliveries',
            'TRANSFER': 'transfers',
            'ADJUSTMENT': 'adjustments'
        };
        return `/${typeMap[type] || 'history'}/${id}`;
    };

    const filteredMoves = data.filter((move) => {
        const matchesSearch = move.product.name.toLowerCase().includes(search.toLowerCase()) ||
            move.reference.toLowerCase().includes(search.toLowerCase()) ||
            move.id.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "all" || move.documentType.toLowerCase() === typeFilter;

        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "receipt": return <ArrowDownRight className="h-4 w-4 text-emerald-500" />;
            case "delivery": return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
            case "transfer": return <RefreshCw className="h-4 w-4 text-purple-500" />;
            case "adjustment": return <AlertCircle className="h-4 w-4 text-amber-500" />;
            default: return <ArrowRight className="h-4 w-4" />;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type.toLowerCase()) {
            case "receipt": return <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 w-24 justify-center">Receipt</Badge>;
            case "delivery": return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 w-24 justify-center">Delivery</Badge>;
            case "transfer": return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 w-24 justify-center">Internal</Badge>;
            case "adjustment": return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 w-24 justify-center">Adjustment</Badge>;
            default: return <Badge variant="outline" className="w-24 justify-center">{type}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Input
                    placeholder="Search product, reference or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Movements</SelectItem>
                            <SelectItem value="receipt">Receipts</SelectItem>
                            <SelectItem value="delivery">Deliveries</SelectItem>
                            <SelectItem value="transfer">Internal Transfers</SelectItem>
                            <SelectItem value="adjustment">Adjustments</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Date/Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Movement Route</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMoves.map((move) => (
                            <TableRow key={move.id}>
                                <TableCell className="text-sm font-medium whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span>{new Date(move.createdAt).toLocaleDateString()}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(move.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(move.documentType)}
                                        {getTypeBadge(move.documentType)}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link href={`/products/${move.productId}`} className="hover:underline hover:text-primary">
                                        {move.product.name}
                                    </Link>
                                    <span className="block text-[10px] text-muted-foreground font-mono">{move.product.sku}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="text-muted-foreground text-xs">
                                            From: {move.source?.name || (move.documentType === 'RECEIPT' ? 'Vendor/External' : 'N/A')}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            To: {move.destination?.name || (move.documentType === 'DELIVERY' ? 'Customer/External' : 'N/A')}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={getDocumentLink(move.documentType, move.documentId)}
                                        className="flex flex-col hover:text-primary transition-colors group"
                                    >
                                        <span className="text-xs font-semibold group-hover:underline">Ref: {move.reference}</span>
                                        <span className="text-[10px] text-muted-foreground font-mono">ID: {move.id.substring(0, 8)}...</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={`font-medium font-mono ${move.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {move.quantity > 0 ? '+' : ''}{move.quantity}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredMoves.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No movement records found matching the current filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
