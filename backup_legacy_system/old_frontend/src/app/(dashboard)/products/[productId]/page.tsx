import { PageTitle } from "@/components/common/page-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, FileEdit, Package, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Metadata } from "next";
import { ProductService } from "@/server/services/product.service";
import { LedgerService } from "@/server/services/ledger.service";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Product Details | Core Inventory",
    description: "View product information and stock levels",
};

const productService = new ProductService();
const ledgerService = new LedgerService();

export default async function ProductDetailsPage({ params }: { params: { productId: string } }) {
    const product = await productService.getProductById(params.productId);
    
    if (!product) {
        notFound();
    }

    const stocks = await ledgerService.getStockForProduct(params.productId);
    const totalStock = stocks.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <PageTitle
                    title={product.name}
                    action={
                        <Link href={`/products/${product.id}/edit`} className={cn(buttonVariants({ variant: "default" }))}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit Product
                        </Link>
                    }
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">SKU / Reference</p>
                                <p className="font-mono font-medium mt-1">{product.sku}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Category</p>
                                <p className="font-medium mt-1">{product.category?.name || "Uncategorized"}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Unit of Measure</p>
                                <p className="font-medium mt-1 uppercase text-xs">{(product as any).uom || 'units'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Price / Cost</p>
                                <p className="font-medium mt-1">${product.price.toFixed(2)} / <span className="text-muted-foreground text-xs">${product.cost.toFixed(2)}</span></p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Description</p>
                            <p className="text-sm mt-1">{product.description || "No description provided."}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Inventory Summary</CardTitle>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Total Available</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
                            <span className="text-6xl font-bold tracking-tighter">{totalStock}</span>
                            <span className="text-muted-foreground mt-2 font-medium uppercase text-xs tracking-widest">{(product as any).uom || 'units'} on hand</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        Stock by Location
                    </CardTitle>
                    <CardDescription>Breakdown of where inventory is stored</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Warehouse / Location</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Quantity Available</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stocks.map((stock) => (
                                <TableRow key={stock.id}>
                                    <TableCell className="font-medium">{stock.location.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                                            {stock.location.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        {stock.quantity} {(product as any).uom || 'units'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {stocks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic">
                                        No stock recorded for this product in any location.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
