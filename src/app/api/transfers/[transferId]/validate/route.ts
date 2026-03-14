import { NextResponse } from "next/server";
import { apiHandler, requireRole } from "@/server/helpers/api.helper";
import { TransferService } from "@/server/services/transfer.service";

const transferService = new TransferService();

export const POST = apiHandler(async (req, { params }: { params: { transferId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const transfer = await transferService.validateTransfer(params.transferId);
  return NextResponse.json(transfer);
});
