'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ClipboardList, Truck, ArrowLeftRight, TrendingUp, Warehouse, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/shared/kpi-card';
import { KPISkeleton, ChartSkeleton } from '@/components/shared/skeletons';
import { StatusBadge } from '@/components/shared/status-badge';
import { productService, receiptService, deliveryService, transferService, stockService, formatDate } from '@/services';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const { data: receipts, isLoading: loadingReceipts } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => receiptService.getAll(),
  });

  const { data: deliveries, isLoading: loadingDeliveries } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => deliveryService.getAll(),
  });

  const { data: transfers, isLoading: loadingTransfers } = useQuery({
    queryKey: ['transfers'],
    queryFn: () => transferService.getAll(),
  });

  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: ['chartData'],
    queryFn: () => stockService.getChartData(),
  });

  const { data: activity, isLoading: loadingActivity } = useQuery({
    queryKey: ['activity'],
    queryFn: () => stockService.getActivity(),
  });

  const isLoading = loadingProducts || loadingReceipts || loadingDeliveries || loadingTransfers;

  const totalStock = products?.reduce((sum, p) => sum + p.totalStock, 0) || 0;
  const lowStockCount = products?.filter((p) => p.availableStock <= p.reorderLevel).length || 0;
  const pendingReceipts = receipts?.filter((r) => r.status === 'confirmed').length || 0;
  const pendingDeliveries = deliveries?.filter((d) => d.status === 'confirmed').length || 0;

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your inventory operations
        </p>
      </motion.div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <KPISkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Total Products" value={products?.length || 0} change={12} changeLabel="vs last month" icon={Package} delay={0} href="/products" />
          <KPICard title="Total Stock Units" value={totalStock.toLocaleString()} change={8.2} changeLabel="vs last month" icon={Warehouse} iconColor="text-blue-500" delay={0.1} href="/stock-ledger" />
          <KPICard title="Pending Receipts" value={pendingReceipts} change={-5} changeLabel="vs last week" icon={ClipboardList} iconColor="text-amber-500" delay={0.2} href="/receipts?status=confirmed" />
          <KPICard title="Low Stock Items" value={lowStockCount} change={lowStockCount > 0 ? 15 : -10} changeLabel="need reorder" icon={AlertTriangle} iconColor="text-red-500" delay={0.3} href="/products?filter=low-stock" />
        </div>
      )}

      {/* Charts + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Operations Chart */}
        {loadingChart ? (
          <div className="lg:col-span-2"><ChartSkeleton /></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Operations Overview
                </CardTitle>
                <CardDescription>Daily warehouse operations for the last 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReceipts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTransfers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} 
                      tickLine={false}
                      axisLine={false}
                      className="text-foreground/70" 
                      tickFormatter={(v) => v.slice(5)} 
                      dy={10}
                    />
                    <YAxis 
                      tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} 
                      tickLine={false}
                      axisLine={false}
                      className="text-foreground/70" 
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{
                        fontSize: '15px',
                        fontWeight: '600',
                        padding: '4px 0',
                      }}
                      labelStyle={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'hsl(var(--foreground))',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        fontSize: '13px', 
                        fontWeight: '600',
                        paddingTop: '20px'
                      }} 
                    />
                    <Area type="monotone" dataKey="receipts" stroke="hsl(142 71% 45%)" fill="url(#colorReceipts)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="deliveries" stroke="hsl(217 91% 60%)" fill="url(#colorDeliveries)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="transfers" stroke="hsl(38 92% 50%)" fill="url(#colorTransfers)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest warehouse operations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[320px]">
                <div className="space-y-0 px-6">
                  {loadingActivity ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                          <div className="h-2.5 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))
                  ) : (
                    activity?.slice(0, 8).map((item) => {
                      const iconMap = {
                        receipt: ClipboardList,
                        delivery: Truck,
                        transfer: ArrowLeftRight,
                        adjustment: Package,
                        product: Package,
                      };
                      const Icon = iconMap[item.type];
                      return (
                        <div key={item.id} className="flex gap-3 py-3 border-b border-border last:border-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{item.user}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Operations Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Receipts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Receipts</CardTitle>
                <CardDescription>Incoming stock operations</CardDescription>
              </div>
              <Link href="/receipts" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receipts?.slice(0, 4).map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{receipt.reference}</p>
                      <p className="text-xs text-muted-foreground">{receipt.supplier}</p>
                    </div>
                    <StatusBadge status={receipt.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Deliveries */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Deliveries</CardTitle>
                <CardDescription>Outgoing stock operations</CardDescription>
              </div>
              <Link href="/deliveries" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliveries?.slice(0, 4).map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{delivery.reference}</p>
                      <p className="text-xs text-muted-foreground">{delivery.customer}</p>
                    </div>
                    <StatusBadge status={delivery.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
