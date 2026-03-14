import { PageTitle } from "@/components/common/page-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReceiptService } from "@/server/services/receipt.service";
import { notFound } from "next/navigation";
import { DetailActions } from "@/components/common/detail-actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const receiptService = new ReceiptService();

export default async function ReceiptDetailsPage({ params }: { params: { receiptId: string } }) {
    const session = await getServerSession(authOptions);
    const receipt = await receiptService.getReceiptById(params.receiptId);

    if (!receipt) {
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
                <Link href="/receipts" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <PageTitle
                    title={`Receipt: ${receipt.reference}`}
                    description={`Managed by ${receipt.createdBy.name}`}
                    action={
                        <div className="flex gap-2">
                             {receipt.status === "DRAFT" && (
                                <Link href={`/receipts/${receipt.id}/edit`} className={cn(buttonVariants({ variant: "outline" }))}>
                                    Edit
                                </Link>
                            )}
                            <DetailActions 
                                id={receipt.id} 
                                type="receipt" 
                                status={receipt.status} 
                                isManager={isManager} 
                            />
                        </div>
                    }
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Items Ordered</CardTitle>
                        <CardDescription>Products included in this receipt</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {receipt.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.product.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{item.product.sku}</TableCell>
                                        <TableCell className="text-right">{item.quantity} {(item.product as any).uom}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transfer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Status</p>
                                <div className="mt-1">
                                    <Badge variant="outline" className={getStatusColor(receipt.status)}>
                                        <span className="mr-1.5">{getStatusIcon(receipt.status)}</span>
                                        {receipt.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Destination</p>
                                <p className="font-medium mt-1">{receipt.destination.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Created At</p>
                                <p className="font-medium mt-1">{new Date(receipt.createdAt).toLocaleDateString()}</p>
                            </div>
                            {receipt.validatedAt && (
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Validated At</p>
                                    <p className="font-medium mt-1">{new Date(receipt.validatedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic">
                                {receipt.notes || "No notes provided for this receipt."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
