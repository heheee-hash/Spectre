"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

const getIcon = (type: string) => {
    switch (type) {
        case "receipt": return <ArrowDownToLine className="h-4 w-4 text-emerald-500" />;
        case "delivery": return <ArrowUpFromLine className="h-4 w-4 text-blue-500" />;
        case "transfer": return <ArrowRightLeft className="h-4 w-4 text-amber-500" />;
        default: return <PackageOpen className="h-4 w-4" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "ready": return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20";
        case "waiting": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
        case "draft": return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
        default: return "bg-muted text-muted-foreground";
    }
};

interface Operation {
    id: string;
    type: string;
    status: string;
    date: Date;
}

export function PendingOperations({ operations }: { operations: Operation[] }) {
    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hrs ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " secs ago";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Operations</CardTitle>
                <CardDescription>Documents requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {operations.map((op) => (
                        <div key={op.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-full bg-muted p-2">
                                    {getIcon(op.type)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{op.id}</p>
                                    <p className="text-xs text-muted-foreground mt-1 capitalize">{op.type}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <Badge variant="secondary" className={`capitalize ${getStatusColor(op.status)}`}>
                                    {op.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{formatTimeAgo(op.date)}</span>
                            </div>
                        </div>
                    ))}
                    {operations.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No pending operations.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
