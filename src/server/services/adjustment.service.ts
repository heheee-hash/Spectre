import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

export class AdjustmentService {
  async getAdjustments() {
    return prisma.adjustment.findMany({
      include: {
        location: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getAdjustmentById(id: string) {
    return prisma.adjustment.findUnique({
      where: { id },
      include: {
        location: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      }
    });
  }

  async createAdjustment(data: any, userId: string) {
    const count = await prisma.adjustment.count();
    const reference = `ADJ-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return prisma.adjustment.create({
      data: {
        reference,
        locationId: data.locationId,
        reason: data.reason,
        createdById: userId,
        status: DocumentStatus.DRAFT,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            countedQty: item.countedQty,
            systemQty: item.systemQty,
            variance: item.countedQty - item.systemQty,
          }))
        }
      },
      include: { items: true, location: true }
    });
  }

  async updateAdjustment(id: string, data: any) {
    const adjustment = await prisma.adjustment.findUnique({ where: { id }});
    if (adjustment?.status !== DocumentStatus.DRAFT) throw new Error("Can only update draft adjustments");

    return prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.adjustmentItem.deleteMany({ where: { adjustmentId: id } });
        await tx.adjustment.update({
          where: { id },
          data: {
            items: {
              create: data.items.map((item: any) => ({
                productId: item.productId,
                countedQty: item.countedQty,
                systemQty: item.systemQty,
                variance: item.countedQty - item.systemQty,
              }))
            }
          }
        });
      }

      return tx.adjustment.update({
        where: { id },
        data: {
          locationId: data.locationId,
          reason: data.reason,
        },
        include: { items: { include: { product: true } }, location: true }
      });
    });
  }

  async updateStatus(id: string, status: DocumentStatus) {
    return prisma.adjustment.update({
      where: { id },
      data: { status }
    });
  }

  async validateAdjustment(id: string) {
    const adjustment = await prisma.adjustment.findUnique({
      where: { id },
      include: { items: true, location: true }
    });

    if (!adjustment) throw new Error("Adjustment not found");
    if (adjustment.status === DocumentStatus.DONE) throw new Error("Adjustment already validated");
    if (adjustment.status === DocumentStatus.CANCELED) throw new Error("Cannot validate canceled adjustment");

    return prisma.$transaction(async (tx) => {
      for (const item of adjustment.items) {
        // 1. Update stock levels to match physical count
        await tx.productStock.upsert({
          where: {
            productId_locationId: {
              productId: item.productId,
              locationId: adjustment.locationId
            }
          },
          update: {
            quantity: item.countedQty
          },
          create: {
            productId: item.productId,
            locationId: adjustment.locationId,
            quantity: item.countedQty
          }
        });

        // 2. Create ledger entry for the variance
        if (item.variance !== 0) {
          await tx.stockLedger.create({
            data: {
              productId: item.productId,
              sourceId: item.variance < 0 ? adjustment.locationId : null,
              destinationId: item.variance > 0 ? adjustment.locationId : null,
              quantity: item.variance,
              documentType: "ADJUSTMENT",
              documentId: adjustment.id,
              reference: adjustment.reference,
              createdById: adjustment.createdById
            }
          });
        }
      }

      // 3. Mark adjustment as done
      return tx.adjustment.update({
        where: { id },
        data: {
          status: DocumentStatus.DONE,
          validatedAt: new Date()
        }
      });
    });
  }

  async deleteAdjustment(id: string) {
    const adjustment = await prisma.adjustment.findUnique({ where: { id }});
    if (adjustment?.status !== DocumentStatus.DRAFT) throw new Error("Can only delete draft adjustments");
    
    return prisma.adjustment.delete({ where: { id } });
  }
}
