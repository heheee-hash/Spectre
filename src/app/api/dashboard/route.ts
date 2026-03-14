import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { DashboardService } from "@/server/services/dashboard.service";

const dashboardService = new DashboardService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const kpis = await dashboardService.getKpis();
  const operations = await dashboardService.getRecentOperations();
  const alerts = await dashboardService.getLowStockAlerts();
  const trend = await dashboardService.getMovementsTrend();
  const categories = await dashboardService.getStockByCategory();
  
  return NextResponse.json({
    kpis,
    operations,
    alerts,
    trend,
    categories,
  });
});
