import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { DeliveryService } from "@/server/services/delivery.service";
import { deliveryCreateSchema } from "@/schemas/delivery.schema";

const deliveryService = new DeliveryService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const deliveries = await deliveryService.getDeliveries();
  return NextResponse.json(deliveries);
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();
  const body = await req.json();
  const validated = deliveryCreateSchema.parse(body);
  const delivery = await deliveryService.createDelivery(validated, user.id);
  return NextResponse.json(delivery, { status: 201 });
});
