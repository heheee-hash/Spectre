import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { TransferService } from "@/server/services/transfer.service";
import { transferCreateSchema } from "@/schemas/transfer.schema";

const transferService = new TransferService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const transfers = await transferService.getTransfers();
  return NextResponse.json(transfers);
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();
  const body = await req.json();
  const validated = transferCreateSchema.parse(body);
  const transfer = await transferService.createTransfer(validated, user.id);
  return NextResponse.json(transfer, { status: 201 });
});
