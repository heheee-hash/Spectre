import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { ReceiptService } from "@/server/services/receipt.service";
import { receiptCreateSchema } from "@/schemas/receipt.schema";

const receiptService = new ReceiptService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const receipts = await receiptService.getReceipts();
  return NextResponse.json(receipts);
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();
  const body = await req.json();
  const validated = receiptCreateSchema.parse(body);
  const receipt = await receiptService.createReceipt(validated, user.id);
  return NextResponse.json(receipt, { status: 201 });
});
