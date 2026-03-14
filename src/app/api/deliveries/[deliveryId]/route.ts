import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { DeliveryService } from "@/server/services/delivery.service";
import { deliveryUpdateSchema } from "@/schemas/delivery.schema";

const deliveryService = new DeliveryService();

export const GET = apiHandler(async (req, { params }: { params: { deliveryId: string } }) => {
  await requireAuth();
  const delivery = await deliveryService.getDeliveryById(params.deliveryId);
  if (!delivery) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(delivery);
});

export const PATCH = apiHandler(async (req, { params }: { params: { deliveryId: string } }) => {
  await requireAuth();
  const body = await req.json();
  const validated = deliveryUpdateSchema.parse(body);
  const delivery = await deliveryService.updateDelivery(params.deliveryId, validated);
  return NextResponse.json(delivery);
});

export const DELETE = apiHandler(async (req, { params }: { params: { deliveryId: string } }) => {
  await requireAuth();
  await deliveryService.deleteDelivery(params.deliveryId);
  return new NextResponse(null, { status: 204 });
});
