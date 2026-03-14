import { PageTitle } from "@/components/common/page-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeliveryService } from "@/server/services/delivery.service";
import { notFound } from "next/navigation";
import { DetailActions } from "@/components/common/detail-actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const deliveryService = new DeliveryService();

export default async function DeliveryDetailsPage({ params }: { params: { deliveryId: string } }) {
    const session = await getServerSession(authOptions);
    const delivery = await deliveryService.getDeliveryById(params.deliveryId);

    if (!delivery) {
        notFound();
    }

    const isManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "READY": return <Clock className="h-4 w-4 text-blue-500" />;
            case "WAITING": return <Clock className="h-4 w-4 text-amber-500" />;
            case "DRAFT": return <AlertCircle className="h-4 w-4 text-slate-500" />;
            case "CANCELED": return <AlertCircle className="h-4 w-4 text-rose-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "READY": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "WAITING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
            case "DRAFT": return "bg-slate-500/10 text-slate-600 border-slate-500/20";
            case "CANCELED": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
            default: return "";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/deliveries" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <PageTitle
                    title={`Delivery: ${delivery.reference}`}
                    description={`Managed by ${delivery.createdBy.name}`}
                    action={
                        <div className="flex gap-2">
                             {delivery.status === "DRAFT" && (
                                <Link href={`/deliveries/${delivery.id}/edit`} className={cn(buttonVariants({ variant: "outline" }))}>
                                    Edit
                                </Link>
                            )}
                            <DetailActions 
                                id={delivery.id} 
                                type="delivery" 
                                status={delivery.status} 
                                isManager={isManager} 
                            />
                        </div>
                    }
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Items to Deliver</CardTitle>
                        <CardDescription>Products included in this delivery order</CardDescription>
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
                                {delivery.items.map((item) => (
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
                            <CardTitle>Logistics Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Status</p>
                                <div className="mt-1">
                                    <Badge variant="outline" className={getStatusColor(delivery.status)}>
                                        <span className="mr-1.5">{getStatusIcon(delivery.status)}</span>
                                        {delivery.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Source Warehouse</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{delivery.source.name}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Created At</p>
                                <p className="font-medium mt-1">{new Date(delivery.createdAt).toLocaleDateString()}</p>
                            </div>
                            {delivery.validatedAt && (
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">Validated At</p>
                                    <p className="font-medium mt-1">{new Date(delivery.validatedAt).toLocaleDateString()}</p>
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
                                {delivery.notes || "No notes provided."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
