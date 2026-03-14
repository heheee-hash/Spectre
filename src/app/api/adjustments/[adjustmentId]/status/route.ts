import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { AdjustmentService } from "@/server/services/adjustment.service";

const adjustmentService = new AdjustmentService();

export const PATCH = apiHandler(async (req, { params }: { params: { adjustmentId: string } }) => {
  await requireAuth();
  const { status } = await req.json();
  const adjustment = await adjustmentService.updateStatus(params.adjustmentId, status);
  return NextResponse.json(adjustment);
});
