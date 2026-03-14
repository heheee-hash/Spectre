import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { LocationService } from "@/server/services/warehouse.service";

const locationService = new LocationService();

export const GET = apiHandler(async (req, { params }: { params: { locationId: string } }) => {
  await requireAuth();
  const location = await locationService.getLocationById(params.locationId);
  if (!location) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(location);
});

export const PATCH = apiHandler(async (req, { params }: { params: { locationId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const location = await locationService.updateLocation(params.locationId, body);
  return NextResponse.json(location);
});

export const DELETE = apiHandler(async (req, { params }: { params: { locationId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  await locationService.deleteLocation(params.locationId);
  return new NextResponse(null, { status: 204 });
});
