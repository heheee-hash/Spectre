import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { AdjustmentService } from "@/server/services/adjustment.service";
import { adjustmentUpdateSchema } from "@/schemas/adjustment.schema";

const adjustmentService = new AdjustmentService();

export const GET = apiHandler(async (req, { params }: { params: { adjustmentId: string } }) => {
  await requireAuth();
  const adjustment = await adjustmentService.getAdjustmentById(params.adjustmentId);
  if (!adjustment) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(adjustment);
});

export const PATCH = apiHandler(async (req, { params }: { params: { adjustmentId: string } }) => {
  await requireAuth();
  const body = await req.json();
  const validated = adjustmentUpdateSchema.parse(body);
  const adjustment = await adjustmentService.updateAdjustment(params.adjustmentId, validated);
  return NextResponse.json(adjustment);
});

export const DELETE = apiHandler(async (req, { params }: { params: { adjustmentId: string } }) => {
  await requireAuth();
  await adjustmentService.deleteAdjustment(params.adjustmentId);
  return new NextResponse(null, { status: 204 });
});
