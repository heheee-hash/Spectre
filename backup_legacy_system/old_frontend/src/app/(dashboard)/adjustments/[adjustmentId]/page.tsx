import { PageTitle } from "@/components/common/page-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, Info } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdjustmentService } from "@/server/services/adjustment.service";
import { notFound } from "next/navigation";
import { DetailActions } from "@/components/common/detail-actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cn } from "@/lib/utils";

const adjustmentService = new AdjustmentService();

export default async function AdjustmentDetailsPage({ params }: { params: { adjustmentId: string } }) {
    const session = await getServerSession(authOptions);
    const adjustment = await adjustmentService.getAdjustmentById(params.adjustmentId);

    if (!adjustment) {
        notFound();
    }

    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "DRAFT": return <AlertCircle className="h-4 w-4 text-slate-500" />;
            case "CANCELED": return <AlertCircle className="h-4 w-4 text-rose-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "DRAFT": return "bg-slate-500/10 text-slate-600 border-slate-500/20";
            case "CANCELED": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
            default: return "";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/adjustments" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <PageTitle
                    title={`Adjustment: ${adjustment.reference}`}
                    description={`Managed by ${adjustment.createdBy.name}`}
                    action={
                        <div className="flex gap-2">
                             {adjustment.status === "DRAFT" && (
                                <Link href={`/adjustments/${adjustment.id}/edit`} className={cn(buttonVariants({ variant: "outline" }))}>
                                    Edit
                                </Link>
                            )}
                            <DetailActions 
                                id={adjustment.id} 
                                type="adjustment" 
                                status={adjustment.status} 
                                isManager={isManager} 
                            />
                        </div>
                    }
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Physical Count Results</CardTitle>
                        <CardDescription>Comparison between system stock and physical count</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">System Qty</TableHead>
                                    <TableHead className="text-right">Counted Qty</TableHead>
                                    <TableHead className="text-right">Variance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adjustment.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{item.product.sku}</p>
                                        </TableCell>
                                        <TableCell className="text-right">{item.systemQty} {(item.product as any).uom}</TableCell>
                                        <TableCell className="text-right font-semibold">{item.countedQty} {(item.product as any).uom}</TableCell>
                                        <TableCell className={cn(
                                            "text-right font-bold",
                                            item.variance > 0 ? "text-emerald-600" : item.variance < 0 ? "text-rose-600" : "text-muted-foreground"
                                        )}>
                                            {item.variance > 0 ? "+" : ""}{item.variance}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Adjustment Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Status</p>
                                <div className="mt-1">
                                    <Badge variant="outline" className={getStatusColor(adjustment.status)}>
                                        <span className="mr-1.5">{getStatusIcon(adjustment.status)}</span>
                                        {adjustment.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Location</p>
                                <p className="font-medium mt-1">{adjustment.location.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Reason</p>
                                <p className="text-sm mt-1">{adjustment.reason || "Periodic Inventory Count"}</p>
                            </div>
                            {adjustment.validatedAt && (
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Validated At</p>
                                    <p className="font-medium mt-1">{new Date(adjustment.validatedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3">
                        <Info className="h-5 w-5 text-blue-500 shrink-0" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Validating this adjustment will instantly update the stock levels for the selected items at <strong>{adjustment.location.name}</strong> to match the counted quantity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
