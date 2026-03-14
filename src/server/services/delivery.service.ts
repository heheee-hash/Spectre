import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

export class DeliveryService {
  async getDeliveries() {
    return prisma.delivery.findMany({
      include: {
        source: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getDeliveryById(id: string) {
    return prisma.delivery.findUnique({
      where: { id },
      include: {
        source: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      }
    });
  }

  async createDelivery(data: any, userId: string) {
    const count = await prisma.delivery.count();
    const reference = `DL-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return prisma.delivery.create({
      data: {
        reference,
        sourceId: data.sourceId,
        customerId: data.customerId,
        notes: data.notes,
        createdById: userId,
        status: DocumentStatus.DRAFT,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        }
      },
      include: { items: true, source: true }
    });
  }

  async updateDelivery(id: string, data: any) {
    const delivery = await prisma.delivery.findUnique({ where: { id }});
    if (delivery?.status !== DocumentStatus.DRAFT) throw new Error("Can only update draft deliveries");

    return prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.deliveryItem.deleteMany({ where: { deliveryId: id } });
        await tx.delivery.update({
          where: { id },
          data: {
            items: {
              create: data.items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
              }))
            }
          }
        });
      }

      return tx.delivery.update({
        where: { id },
        data: {
          sourceId: data.sourceId,
          customerId: data.customerId,
          notes: data.notes,
        },
        include: { items: { include: { product: true } }, source: true }
      });
    });
  }

  async updateStatus(id: string, status: DocumentStatus) {
    return prisma.delivery.update({
      where: { id },
      data: { status }
    });
  }

  async validateDelivery(id: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: { items: true, source: true }
    });

    if (!delivery) throw new Error("Delivery not found");
    if (delivery.status === DocumentStatus.DONE) throw new Error("Delivery already validated");
    if (delivery.status === DocumentStatus.CANCELED) throw new Error("Cannot validate canceled delivery");

    return prisma.$transaction(async (tx) => {
      for (const item of delivery.items) {
        // 1. Check availability
        const stock = await tx.productStock.findUnique({
          where: {
            productId_locationId: {
              productId: item.productId,
              locationId: delivery.sourceId
            }
          }
        });

        if (!stock || stock.quantity < item.quantity) {
          // In a real app, we might want to return a list of missing items
          throw new Error(`Insufficient stock for product ${item.productId} at source location`);
        }

        // 2. Update stock levels
        await tx.productStock.update({
          where: { id: stock.id },
          data: { quantity: { decrement: item.quantity } }
        });

        // 3. Create ledger entry
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            sourceId: delivery.sourceId,
            quantity: -item.quantity,
            documentType: "DELIVERY",
            documentId: delivery.id,
            reference: delivery.reference,
            createdById: delivery.createdById
          }
        });
      }

      // 4. Mark delivery as done
      return tx.delivery.update({
        where: { id },
        data: {
          status: DocumentStatus.DONE,
          validatedAt: new Date()
        }
      });
    });
  }

  async deleteDelivery(id: string) {
    const delivery = await prisma.delivery.findUnique({ where: { id }});
    if (delivery?.status !== DocumentStatus.DRAFT) throw new Error("Can only delete draft deliveries");
    
    return prisma.delivery.delete({ where: { id } });
  }
}
