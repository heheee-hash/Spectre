import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { ReceiptService } from "@/server/services/receipt.service";

const receiptService = new ReceiptService();

export const PATCH = apiHandler(async (req, { params }: { params: { receiptId: string } }) => {
  await requireAuth();
  const { status } = await req.json();
  const receipt = await receiptService.updateStatus(params.receiptId, status);
  return NextResponse.json(receipt);
});
