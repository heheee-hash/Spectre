import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { WarehouseService } from "@/server/services/warehouse.service";

const warehouseService = new WarehouseService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const warehouses = await warehouseService.getWarehouses();
  return NextResponse.json(warehouses);
});

export const POST = apiHandler(async (req) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const warehouse = await warehouseService.createWarehouse(body);
  return NextResponse.json(warehouse, { status: 201 });
});
