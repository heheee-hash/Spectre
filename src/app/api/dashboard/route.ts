import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { DashboardService } from "@/server/services/dashboard.service";

const dashboardService = new DashboardService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const kpis = await dashboardService.getKpis();
  return NextResponse.json(kpis);
});
