import { PageTitle } from "@/components/common/page-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransferService } from "@/server/services/transfer.service";
import { notFound } from "next/navigation";
import { DetailActions } from "@/components/common/detail-actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const transferService = new TransferService();

export default async function TransferDetailsPage({ params }: { params: { transferId: string } }) {
    const session = await getServerSession(authOptions);
    const transfer = await transferService.getTransferById(params.transferId);

    if (!transfer) {
        notFound();
    }

    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "READY": return <Clock className="h-4 w-4 text-blue-500" />;
            case "DRAFT": return <AlertCircle className="h-4 w-4 text-slate-500" />;
            case "CANCELED": return <AlertCircle className="h-4 w-4 text-rose-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "READY": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "DRAFT": return "bg-slate-500/10 text-slate-600 border-slate-500/20";
            case "CANCELED": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
            default: return "";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/transfers" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <PageTitle
                    title={`Transfer: ${transfer.reference}`}
                    description={`Managed by ${transfer.createdBy.name}`}
                    action={
                        <div className="flex gap-2">
                             {transfer.status === "DRAFT" && (
                                <Link href={`/transfers/${transfer.id}/edit`} className={cn(buttonVariants({ variant: "outline" }))}>
                                    Edit
                                </Link>
                            )}
                            <DetailActions 
                                id={transfer.id} 
                                type="transfer" 
                                status={transfer.status} 
                                isManager={isManager} 
                            />
                        </div>
                    }
                />
            </div>

            <Card>
                <CardHeader className="border-b pb-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>Internal Movement</CardTitle>
                            <CardDescription>Stock transfer between locations</CardDescription>
                        </div>
                        <Badge variant="outline" className={getStatusColor(transfer.status)}>
                            <span className="mr-1.5">{getStatusIcon(transfer.status)}</span>
                            {transfer.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-4 bg-muted/30 rounded-lg border border-dashed mb-6">
                        <div className="text-center px-8">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Source</p>
                            <p className="font-semibold text-lg">{transfer.source.name}</p>
                        </div>
                        <ArrowRight className="h-8 w-8 text-muted-foreground/40 mx-4" />
                        <div className="text-center px-8">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Destination</p>
                            <p className="font-semibold text-lg">{transfer.destination.name}</p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfer.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.product.name}</TableCell>
                                    <TableCell className="font-mono text-xs">{item.product.sku}</TableCell>
                                    <TableCell className="text-right">{item.quantity} {(item.product as any).uom}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {transfer.notes && (
                        <div className="mt-8 pt-6 border-t">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Notes</p>
                            <p className="text-sm text-muted-foreground">{transfer.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
