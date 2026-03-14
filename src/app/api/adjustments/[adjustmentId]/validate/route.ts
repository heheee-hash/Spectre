import { NextResponse } from "next/server";
import { apiHandler, requireRole } from "@/server/helpers/api.helper";
import { AdjustmentService } from "@/server/services/adjustment.service";

const adjustmentService = new AdjustmentService();

export const POST = apiHandler(async (req, { params }: { params: { adjustmentId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const adjustment = await adjustmentService.validateAdjustment(params.adjustmentId);
  return NextResponse.json(adjustment);
});
