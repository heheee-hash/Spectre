import { NextResponse } from "next/server";
import { apiHandler, requireAuth } from "@/server/helpers/api.helper";
import { LedgerService } from "@/server/services/ledger.service";

const ledgerService = new LedgerService();

export const GET = apiHandler(async (req) => {
  await requireAuth();
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  if (productId) {
    const stock = await ledgerService.getStockForProduct(productId);
    return NextResponse.json(stock);
  }

  const allStock = await ledgerService.getStockByLocation();
  return NextResponse.json(allStock);
});
