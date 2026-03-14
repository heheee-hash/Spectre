import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { AdjustmentService } from "@/server/services/adjustment.service";
import { adjustmentCreateSchema } from "@/schemas/adjustment.schema";

const adjustmentService = new AdjustmentService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const adjustments = await adjustmentService.getAdjustments();
  return NextResponse.json(adjustments);
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();
  const body = await req.json();
  const validated = adjustmentCreateSchema.parse(body);
  const adjustment = await adjustmentService.createAdjustment(validated, user.id);
  return NextResponse.json(adjustment, { status: 201 });
});
