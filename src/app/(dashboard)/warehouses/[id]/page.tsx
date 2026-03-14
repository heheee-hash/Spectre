'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Warehouse as WarehouseIcon, 
  MapPin, 
  User, 
  Activity,
  BarChart2,
  Package,
  Boxes,
  Layers,
  Search,
  ArrowUpRight,
  ArrowDownRight
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
import { Progress } from '@/components/ui/progress';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { warehouseService, stockService } from '@/services';
import { PageLoader } from '@/components/shared';

const zoneColors: Record<string, { fill: string; stroke: string; text: string; label: string }> = {
  storage: { fill: 'bg-blue-500/10', stroke: 'border-blue-500/20', text: 'text-blue-500', label: 'Storage' },
  receiving: { fill: 'bg-emerald-500/10', stroke: 'border-emerald-500/20', text: 'text-emerald-500', label: 'Receiving' },
  shipping: { fill: 'bg-amber-500/10', stroke: 'border-amber-500/20', text: 'text-amber-500', label: 'Shipping' },
  staging: { fill: 'bg-purple-500/10', stroke: 'border-purple-500/20', text: 'text-purple-500', label: 'Staging' },
};

export default function WarehouseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const warehouseId = id as string;

  const { data: warehouse, isLoading: warehouseLoading } = useQuery({
    queryKey: ['warehouses', warehouseId],
    queryFn: () => warehouseService.getById(warehouseId),
  });

  const { data: ledger, isLoading: ledgerLoading } = useQuery({
    queryKey: ['stock-ledger', 'warehouse', warehouse?.name],
    enabled: !!warehouse,
    queryFn: async () => {
      const allLedger = await stockService.getStockLedger();
      return allLedger.filter(entry => entry.warehouseName === warehouse?.name);
    },
  });

  if (warehouseLoading) return <PageLoader />;
  if (!warehouse) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <WarehouseIcon className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Warehouse not found</h2>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  // Calculate current stock levels from ledger
  const inventoryByProduct = ledger?.reduce((acc, entry) => {
    if (!acc[entry.productId]) {
      acc[entry.productId] = {
        id: entry.productId,
        name: entry.productName,
        quantity: 0
      };
    }
    acc[entry.productId].quantity += entry.quantityChange;
    return acc;
  }, {} as Record<string, { id: string, name: string, quantity: number }>);

  const inventoryList = Object.values(inventoryByProduct || {}).filter(item => item.quantity !== 0);

  const totalUtilization = Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{warehouse.name}</h1>
            <Badge variant={warehouse.isActive ? 'outline' : 'secondary'} className={warehouse.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}>
              {warehouse.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <MapPin className="h-3 w-3" /> {warehouse.address}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Capacity</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouse.capacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total storage units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Capacity</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouse.usedCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current occupancy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUtilization}%</div>
            <Progress value={totalUtilization} className="mt-3 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manager</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{warehouse.manager}</div>
            <p className="text-xs text-muted-foreground mt-1">Site Supervisor</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="zones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones" className="gap-2">
            <WarehouseIcon className="h-4 w-4" /> Zone Breakdown
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Package className="h-4 w-4" /> Live Inventory
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Activity className="h-4 w-4" /> Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zones">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {warehouse.zones.map((zone) => {
              const config = zoneColors[zone.type];
              const utilization = Math.round((zone.usedCapacity / zone.capacity) * 100);
              return (
                <Card key={zone.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{zone.name}</CardTitle>
                      <Badge variant="outline" className={`${config.fill} ${config.text} border-none text-[10px] uppercase font-bold`}>
                        {zone.type}
                      </Badge>
                    </div>
                    <CardDescription>Zone ID: {zone.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold">{utilization}%</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Storage Capacity</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{zone.usedCapacity.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Units</p>
                      </div>
                    </div>
                    <Progress value={utilization} className="h-1.5" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Breakdown</CardTitle>
                <CardDescription>Estimated current stock in this warehouse</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter stock..." 
                  className="pl-9 h-9 w-64 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {inventoryList.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Product ID</TableHead>
                      <TableHead className="text-right">On Hand</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                        <TableCell className="text-right font-bold">{item.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/products/${item.id}`)}>
                            View Product
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-8 w-8 mb-2 opacity-20" />
                  <p>No inventory found in this location</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Site Activity</CardTitle>
              <CardDescription>Recent logarithmic entries for this location</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {ledgerLoading ? (
                <div className="p-6">Loading...</div>
              ) : ledger && ledger.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledger.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs">
                          {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {entry.operationType.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{entry.reference}</TableCell>
                        <TableCell className="text-sm font-medium">{entry.productName}</TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end gap-1 font-medium ${entry.quantityChange > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {entry.quantityChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(entry.quantityChange)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Activity className="h-8 w-8 mb-2 opacity-20" />
                  <p>No recent activity recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
