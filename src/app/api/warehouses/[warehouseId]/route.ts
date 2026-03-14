import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { WarehouseService } from "@/server/services/warehouse.service";

const warehouseService = new WarehouseService();

export const GET = apiHandler(async (req, { params }: { params: { warehouseId: string } }) => {
  await requireAuth();
  const warehouse = await warehouseService.getWarehouseById(params.warehouseId);
  if (!warehouse) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(warehouse);
});

export const PATCH = apiHandler(async (req, { params }: { params: { warehouseId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const warehouse = await warehouseService.updateWarehouse(params.warehouseId, body);
  return NextResponse.json(warehouse);
});

export const DELETE = apiHandler(async (req, { params }: { params: { warehouseId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  await warehouseService.deleteWarehouse(params.warehouseId);
  return new NextResponse(null, { status: 204 });
});
