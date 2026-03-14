import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { DeliveryService } from "@/server/services/delivery.service";

const deliveryService = new DeliveryService();

export const PATCH = apiHandler(async (req, { params }: { params: { deliveryId: string } }) => {
  await requireAuth();
  const { status } = await req.json();
  const delivery = await deliveryService.updateStatus(params.deliveryId, status);
  return NextResponse.json(delivery);
});
