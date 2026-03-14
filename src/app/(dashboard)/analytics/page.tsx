'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { ChartSkeleton } from '@/components/shared/skeletons';
import { productService, stockService } from '@/services';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';

const COLORS = ['hsl(217 91% 60%)', 'hsl(142 71% 45%)', 'hsl(38 92% 50%)', 'hsl(280 68% 60%)', 'hsl(348 83% 47%)'];

export default function AnalyticsPage() {
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: ['chartData'],
    queryFn: () => stockService.getChartData(),
  });

  const stockByCategory = products?.reduce((acc, p) => {
    const existing = acc.find((item) => item.name === p.category);
    if (existing) {
      existing.value += p.totalStock;
    } else {
      acc.push({ name: p.category, value: p.totalStock });
    }
    return acc;
  }, [] as { name: string; value: number }[]) || [];

  const productStockData = products?.map((p) => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    available: p.availableStock,
    reserved: p.reservedStock,
    reorderLevel: p.reorderLevel,
  })) || [];

  const cumulativeOps = chartData?.map((d, i) => ({
    date: d.date.slice(5),
    total: d.receipts + d.deliveries + d.transfers,
    cumulative: chartData.slice(0, i + 1).reduce((sum, item) => sum + item.receipts + item.deliveries + item.transfers, 0),
  })) || [];

  const isLoading = loadingProducts || loadingChart;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Analytics" description="Visual insights into your inventory operations" />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Stock by Product */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Stock Levels by Product</CardTitle>
                <CardDescription>Available vs reserved stock per product</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productStockData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} className="text-foreground/70" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} width={100} className="text-foreground/70" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ fontWeight: '600' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '600', paddingTop: '10px' }} />
                    <Bar dataKey="available" fill="hsl(142 71% 45%)" radius={[0, 4, 4, 0]} name="Available" />
                    <Bar dataKey="reserved" fill="hsl(38 92% 50%)" radius={[0, 4, 4, 0]} name="Reserved" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stock Distribution by Category */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Stock by Category</CardTitle>
                <CardDescription>Distribution of total stock across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stockByCategory.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '600', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cumulative Operations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Cumulative Operations</CardTitle>
                <CardDescription>Running total of all warehouse operations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cumulativeOps}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} className="text-foreground/70" dy={10} />
                    <YAxis tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} className="text-foreground/70" dx={-10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ fontWeight: '600' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '600', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="cumulative" stroke="hsl(217 91% 60%)" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Cumulative" />
                    <Line type="monotone" dataKey="total" stroke="hsl(142 71% 45%)" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Daily" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Operations Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Daily Operations Breakdown</CardTitle>
                <CardDescription>Receipts, deliveries, and transfers per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} tickFormatter={(v) => v.slice(5)} className="text-foreground/70" dy={10} />
                    <YAxis tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} className="text-foreground/70" dx={-10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ fontWeight: '600' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '600', paddingTop: '20px' }} />
                    <Bar dataKey="receipts" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} name="Receipts" />
                    <Bar dataKey="deliveries" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} name="Deliveries" />
                    <Bar dataKey="transfers" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} name="Transfers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
