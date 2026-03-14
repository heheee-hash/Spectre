import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

export class ReceiptService {
  async getReceipts() {
    return prisma.receipt.findMany({
      include: {
        destination: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getReceiptById(id: string) {
    return prisma.receipt.findUnique({
      where: { id },
      include: {
        destination: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      }
    });
  }

  async createReceipt(data: any, userId: string) {
    // Generate a simple reference
    const count = await prisma.receipt.count();
    const reference = `RC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return prisma.receipt.create({
      data: {
        reference,
        destinationId: data.destinationId,
        vendorId: data.vendorId,
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
      include: { items: true, destination: true }
    });
  }

  async updateReceipt(id: string, data: any) {
    // In a real system, you'd only allow updates if DRAFT
    const receipt = await prisma.receipt.findUnique({ where: { id }});
    if (receipt?.status !== DocumentStatus.DRAFT) throw new Error("Can only update draft receipts");

    return prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.receiptItem.deleteMany({ where: { receiptId: id } });
        await tx.receipt.update({
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

      return tx.receipt.update({
        where: { id },
        data: {
          destinationId: data.destinationId,
          vendorId: data.vendorId,
          notes: data.notes,
        },
        include: { items: { include: { product: true } }, destination: true }
      });
    });
  }

  async updateStatus(id: string, status: DocumentStatus) {
    return prisma.receipt.update({
      where: { id },
      data: { status }
    });
  }

  async validateReceipt(id: string) {
    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: { items: true, destination: true }
    });

    if (!receipt) throw new Error("Receipt not found");
    if (receipt.status === DocumentStatus.DONE) throw new Error("Receipt already validated");
    if (receipt.status === DocumentStatus.CANCELED) throw new Error("Cannot validate canceled receipt");

    return prisma.$transaction(async (tx) => {
      for (const item of receipt.items) {
        // 1. Update stock levels
        await tx.productStock.upsert({
          where: {
            productId_locationId: {
              productId: item.productId,
              locationId: receipt.destinationId
            }
          },
          update: {
            quantity: { increment: item.quantity }
          },
          create: {
            productId: item.productId,
            locationId: receipt.destinationId,
            quantity: item.quantity
          }
        });

        // 2. Create ledger entry
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            destinationId: receipt.destinationId,
            quantity: item.quantity,
            documentType: "RECEIPT",
            documentId: receipt.id,
            reference: receipt.reference,
            createdById: receipt.createdById
          }
        });
      }

      // 3. Mark receipt as done
      return tx.receipt.update({
        where: { id },
        data: {
          status: DocumentStatus.DONE,
          validatedAt: new Date()
        }
      });
    });
  }

  async deleteReceipt(id: string) {
    const receipt = await prisma.receipt.findUnique({ where: { id }});
    if (receipt?.status !== DocumentStatus.DRAFT) throw new Error("Can only delete draft receipts");
    
    return prisma.receipt.delete({ where: { id } });
  }
}
