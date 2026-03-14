'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  History, 
  Info, 
  BarChart2, 
  Settings,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { productService, stockService, formatCurrency } from '@/services';
import { PageHeader, TableSkeleton, PageLoader } from '@/components/shared';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = id as string;

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.getById(productId),
  });

  const { data: ledger, isLoading: ledgerLoading } = useQuery({
    queryKey: ['stock-ledger', productId],
    queryFn: async () => {
      const allLedger = await stockService.getStockLedger();
      return allLedger.filter(entry => entry.productId === productId);
    },
  });

  if (productLoading) return <PageLoader />;
  if (!product) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <AlertTriangle className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Product not found</h2>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  const isLowStock = product.availableStock <= product.reorderLevel;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            <Badge variant={product.isActive ? 'outline' : 'secondary'} className={product.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}>
              {product.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-muted-foreground">SKU: {product.sku} • {product.category}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{product.availableStock.toLocaleString()} {product.unit}</div>
            <p className={`text-xs mt-1 ${isLowStock ? 'text-red-500 font-medium' : 'text-emerald-500'}`}>
              {isLowStock ? 'Below Reorder Level' : 'Stock level healthy'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sale Price</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(product.salePrice)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {(((product.salePrice - product.costPrice) / product.salePrice) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{product.reservedStock.toLocaleString()} {product.unit}</div>
            <p className="text-xs text-muted-foreground mt-1 text-amber-500">
              Allocated to open orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder At</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{product.reorderLevel.toLocaleString()} {product.unit}</div>
            <p className="text-xs text-muted-foreground mt-1 text-blue-500">
              Procurement threshold
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Info className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" /> Stock History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Information</CardTitle>
                <CardDescription>Detailed product specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Category</p>
                    <p className="text-sm">{product.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Unit of Measure</p>
                    <p className="text-sm">{product.unit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Cost Price</p>
                    <p className="text-sm">{formatCurrency(product.costPrice)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Sale Price</p>
                    <p className="text-sm">{formatCurrency(product.salePrice)}</p>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
                <CardDescription>Current stock distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">In Warehouse</span>
                    <span>{product.totalStock} {product.unit}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(product.availableStock / product.totalStock) * 100 || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>{((product.availableStock / product.totalStock) * 100 || 0).toFixed(0)}% Available</span>
                    <span>{((product.reservedStock / product.totalStock) * 100 || 0).toFixed(0)}% Reserved</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-semibold">{product.availableStock}</span>
                    <span className="text-xs text-muted-foreground">Sellable Units</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-semibold">{product.reservedStock}</span>
                    <span className="text-xs text-muted-foreground">Reserved Units</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>Recent transactions affecting stock levels</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {ledgerLoading ? (
                <div className="p-6"><TableSkeleton rows={5} cols={5} /></div>
              ) : ledger && ledger.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledger.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-sm">
                          {new Date(entry.date).toLocaleDateString()}
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {entry.operationType.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{entry.reference}</TableCell>
                        <TableCell className="text-sm font-medium">{entry.warehouseName}</TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end gap-1 font-medium ${entry.quantityChange > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {entry.quantityChange > 0 ? <Plus className="h-3 w-3" /> : <div className="h-3 w-1 bg-current" />}
                            {Math.abs(entry.quantityChange)}
                            <span className="text-[10px] opacity-70 ml-0.5">{product.unit}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <RefreshCw className="h-8 w-8 mb-2 opacity-20" />
                  <p>No historical movements found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
