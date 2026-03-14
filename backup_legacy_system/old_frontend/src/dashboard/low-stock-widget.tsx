"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface LowStockItem {
    id: string;
    name: string;
    sku: string;
    stock: number;
    minStock: number;
    location: string;
}

export function LowStockWidget({ items }: { items: LowStockItem[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Low Stock Alerts
                </CardTitle>
                <CardDescription>Items below reorder thresholds</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.location}`} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium leading-none">{item.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.sku} • {item.location}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <Badge variant="destructive" className="font-mono text-xs">
                                    {item.stock} / {item.minStock}
                                </Badge>
                                <span className="text-xs text-muted-foreground">in stock</span>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            All items are well stocked.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
