import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { LedgerService } from "@/server/services/ledger.service";

const ledgerService = new LedgerService();

export const GET = apiHandler(async (req) => {
  await requireAuth();
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId") || undefined;
  const locationId = url.searchParams.get("locationId") || undefined;
  const type = url.searchParams.get("type") as "RECEIPT" | "DELIVERY" | "TRANSFER" | "ADJUSTMENT" | undefined;

  const history = await ledgerService.getMoveHistory({ productId, locationId, type });
  return NextResponse.json(history);
});
