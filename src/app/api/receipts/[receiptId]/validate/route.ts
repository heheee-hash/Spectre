import { NextResponse } from "next/server";
import { apiHandler, requireRole } from "@/server/helpers/api.helper";
import { ReceiptService } from "@/server/services/receipt.service";

const receiptService = new ReceiptService();

export const POST = apiHandler(async (req, { params }: { params: { receiptId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const receipt = await receiptService.validateReceipt(params.receiptId);
  return NextResponse.json(receipt);
});
