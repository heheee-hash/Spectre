import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { TransferService } from "@/server/services/transfer.service";
import { transferUpdateSchema } from "@/schemas/transfer.schema";

const transferService = new TransferService();

export const GET = apiHandler(async (req, { params }: { params: { transferId: string } }) => {
  await requireAuth();
  const transfer = await transferService.getTransferById(params.transferId);
  if (!transfer) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(transfer);
});

export const PATCH = apiHandler(async (req, { params }: { params: { transferId: string } }) => {
  await requireAuth();
  const body = await req.json();
  const validated = transferUpdateSchema.parse(body);
  const transfer = await transferService.updateTransfer(params.transferId, validated);
  return NextResponse.json(transfer);
});

export const DELETE = apiHandler(async (req, { params }: { params: { transferId: string } }) => {
  await requireAuth();
  await transferService.deleteTransfer(params.transferId);
  return new NextResponse(null, { status: 204 });
});
