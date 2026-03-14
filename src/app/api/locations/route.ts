import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { LocationService } from "@/server/services/warehouse.service";

const locationService = new LocationService();

export const GET = apiHandler(async (req) => {
  await requireAuth();
  const url = new URL(req.url);
  const warehouseId = url.searchParams.get('warehouseId') || undefined;
  
  const locations = await locationService.getLocations(warehouseId);
  return NextResponse.json(locations);
});

export const POST = apiHandler(async (req) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const location = await locationService.createLocation(body);
  return NextResponse.json(location, { status: 201 });
});
