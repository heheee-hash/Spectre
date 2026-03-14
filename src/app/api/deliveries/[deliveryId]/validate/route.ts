import { NextResponse } from "next/server";
import { apiHandler, requireRole } from "@/server/helpers/api.helper";
import { DeliveryService } from "@/server/services/delivery.service";

const deliveryService = new DeliveryService();

export const POST = apiHandler(async (req, { params }: { params: { deliveryId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const delivery = await deliveryService.validateDelivery(params.deliveryId);
  return NextResponse.json(delivery);
});
