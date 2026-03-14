import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { ReceiptService } from "@/server/services/receipt.service";
import { receiptUpdateSchema } from "@/schemas/receipt.schema";

const receiptService = new ReceiptService();

export const GET = apiHandler(async (req, { params }: { params: { receiptId: string } }) => {
  await requireAuth();
  const receipt = await receiptService.getReceiptById(params.receiptId);
  if (!receipt) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(receipt);
});

export const PATCH = apiHandler(async (req, { params }: { params: { receiptId: string } }) => {
  await requireAuth();
  const body = await req.json();
  const validated = receiptUpdateSchema.parse(body);
  const receipt = await receiptService.updateReceipt(params.receiptId, validated);
  return NextResponse.json(receipt);
});

export const DELETE = apiHandler(async (req, { params }: { params: { receiptId: string } }) => {
  await requireAuth();
  await receiptService.deleteReceipt(params.receiptId);
  return new NextResponse(null, { status: 204 });
});
