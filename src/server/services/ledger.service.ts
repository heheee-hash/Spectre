import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class LedgerService {
  async getMoveHistory(params?: {
    productId?: string;
    locationId?: string;
    type?: "RECEIPT" | "DELIVERY" | "TRANSFER" | "ADJUSTMENT";
  }) {
    const where: Prisma.StockLedgerWhereInput = {};
    
    if (params?.productId) where.productId = params.productId;
    if (params?.locationId) {
      where.OR = [
        { sourceId: params.locationId },
        { destinationId: params.locationId }
      ];
    }
    if (params?.type) where.documentType = params.type;

    return prisma.stockLedger.findMany({
      where,
      include: {
        product: true,
        source: true,
        destination: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getStockByLocation() {
    return prisma.productStock.findMany({
      include: {
        product: true,
        location: true,
      },
      orderBy: [
        { location: { name: "asc" } },
        { product: { name: "asc" } }
      ]
    });
  }

  async getStockForProduct(productId: string) {
    return prisma.productStock.findMany({
      where: { productId },
      include: {
        location: true,
      }
    });
  }
}
