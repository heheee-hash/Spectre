import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

export class TransferService {
  async getTransfers() {
    return prisma.transfer.findMany({
      include: {
        source: true,
        destination: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getTransferById(id: string) {
    return prisma.transfer.findUnique({
      where: { id },
      include: {
        source: true,
        destination: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      }
    });
  }

  async createTransfer(data: any, userId: string) {
    const count = await prisma.transfer.count();
    const reference = `TR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return prisma.transfer.create({
      data: {
        reference,
        sourceId: data.sourceId,
        destinationId: data.destinationId,
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
      include: { items: true, source: true, destination: true }
    });
  }

  async updateTransfer(id: string, data: any) {
    const transfer = await prisma.transfer.findUnique({ where: { id }});
    if (transfer?.status !== DocumentStatus.DRAFT) throw new Error("Can only update draft transfers");

    return prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.transferItem.deleteMany({ where: { transferId: id } });
        await tx.transfer.update({
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

      return tx.transfer.update({
        where: { id },
        data: {
          sourceId: data.sourceId,
          destinationId: data.destinationId,
          notes: data.notes,
        },
        include: { items: { include: { product: true } }, source: true, destination: true }
      });
    });
  }

  async updateStatus(id: string, status: DocumentStatus) {
    return prisma.transfer.update({
      where: { id },
      data: { status }
    });
  }

  async validateTransfer(id: string) {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: { items: true, source: true, destination: true }
    });

    if (!transfer) throw new Error("Transfer not found");
    if (transfer.status === DocumentStatus.DONE) throw new Error("Transfer already validated");
    if (transfer.status === DocumentStatus.CANCELED) throw new Error("Cannot validate canceled transfer");

    return prisma.$transaction(async (tx) => {
      for (const item of transfer.items) {
        // 1. Check availability at source
        const sourceStock = await tx.productStock.findUnique({
          where: {
            productId_locationId: {
              productId: item.productId,
              locationId: transfer.sourceId
            }
          }
        });

        if (!sourceStock || sourceStock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId} at source location`);
        }

        // 2. Reduce source stock
        await tx.productStock.update({
          where: { id: sourceStock.id },
          data: { quantity: { decrement: item.quantity } }
        });

        // 3. Increase destination stock
        await tx.productStock.upsert({
          where: {
            productId_locationId: {
              productId: item.productId,
              locationId: transfer.destinationId
            }
          },
          update: {
            quantity: { increment: item.quantity }
          },
          create: {
            productId: item.productId,
            locationId: transfer.destinationId,
            quantity: item.quantity
          }
        });

        // 4. Create ledger entry
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            sourceId: transfer.sourceId,
            destinationId: transfer.destinationId,
            quantity: item.quantity,
            documentType: "TRANSFER",
            documentId: transfer.id,
            reference: transfer.reference,
            createdById: transfer.createdById
          }
        });
      }

      // 5. Mark transfer as done
      return tx.transfer.update({
        where: { id },
        data: {
          status: DocumentStatus.DONE,
          validatedAt: new Date()
        }
      });
    });
  }

  async deleteTransfer(id: string) {
    const transfer = await prisma.transfer.findUnique({ where: { id }});
    if (transfer?.status !== DocumentStatus.DRAFT) throw new Error("Can only delete draft transfers");
    
    return prisma.transfer.delete({ where: { id } });
  }
}
