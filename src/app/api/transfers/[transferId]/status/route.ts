import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { TransferService } from "@/server/services/transfer.service";

const transferService = new TransferService();

export const PATCH = apiHandler(async (req, { params }: { params: { transferId: string } }) => {
  await requireAuth();
  const { status } = await req.json();
  const transfer = await transferService.updateStatus(params.transferId, status);
  return NextResponse.json(transfer);
});
