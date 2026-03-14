import { KpiCard } from "@/components/dashboard/kpi-card";
import { StockSummaryChart } from "@/components/dashboard/stock-summary-chart";
import { StockCategoryChart } from "@/components/dashboard/stock-category-chart";
import { PendingOperations } from "@/components/dashboard/pending-operations";
import { LowStockWidget } from "@/components/dashboard/low-stock-widget";
import { Package, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, Calendar, AlertTriangle, Boxes } from "lucide-react";
import type { Metadata } from "next";
import { DashboardService } from "@/server/services/dashboard.service";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
    title: "Dashboard | Core Inventory",
    description: "Overview of your inventory",
};

const dashboardService = new DashboardService();

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const kpis = await dashboardService.getKpis();
    const operations = await dashboardService.getRecentOperations();
    const lowStock = await dashboardService.getLowStockAlerts();
    const trendData = await dashboardService.getMovementsTrend();
    const categoryData = await dashboardService.getStockByCategory();
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Good morning, {session?.user?.name || "User"} 👋</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Here&apos;s what&apos;s happening with your inventory today.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border/60 rounded-lg px-3 py-1.5 bg-card shadow-sm w-fit">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">{today}</span>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Total Stock"
                    value={kpis.totalStock.toLocaleString()}
                    icon={Package}
                    description="Units across all locations"
                    color="indigo"
                />
                <KpiCard
                    title="Low Stock Items"
                    value={kpis.lowStockProducts.toString()}
                    icon={AlertTriangle}
                    description="Requires restock"
                    color="amber"
                />
                <KpiCard
                    title="Pending Receipts"
                    value={kpis.pendingReceipts.toString()}
                    icon={ArrowDownToLine}
                    description="Draft or Ready"
                    color="emerald"
                />
                <KpiCard
                    title="Pending Deliveries"
                    value={kpis.pendingDeliveries.toString()}
                    icon={ArrowUpFromLine}
                    description="Waiting or Ready"
                    color="rose"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                 <KpiCard
                    title="Total Products"
                    value={kpis.totalProducts.toString()}
                    icon={Boxes}
                    description="Unique items tracked"
                    color="slate"
                />
                <KpiCard
                    title="Out of Stock"
                    value={kpis.outOfStockProducts.toString()}
                    icon={AlertTriangle}
                    description="Zero units available"
                    color="rose"
                />
                <KpiCard
                    title="Scheduled Transfers"
                    value={kpis.pendingTransfers.toString()}
                    icon={ArrowRightLeft}
                    description="Internal movements"
                    color="blue"
                />
            </div>

            {/* Charts & Widgets */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StockSummaryChart data={trendData} />
                <PendingOperations operations={operations} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
                <StockCategoryChart data={categoryData} />
                <div className="lg:col-span-2">
                    <LowStockWidget items={lowStock} />
                </div>
            </div>
        </div>
    );
}
