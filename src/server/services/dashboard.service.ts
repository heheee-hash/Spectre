import { prisma } from "@/lib/prisma";

export class DashboardService {
  async getKpis() {
    const totalProducts = await prisma.product.count();
    
    const stockStats = await prisma.productStock.aggregate({
      _sum: { quantity: true }
    });

    const lowStockProducts = await prisma.productStock.count({
      where: {
        quantity: { lt: 10, gt: 0 }
      }
    });

    const outOfStockProducts = await prisma.productStock.count({
      where: {
        quantity: { lte: 0 }
      }
    });

    const pendingReceipts = await prisma.receipt.count({
      where: { status: { in: ["DRAFT", "READY"] } }
    });

    const pendingDeliveries = await prisma.delivery.count({
      where: { status: { in: ["DRAFT", "WAITING", "READY"] } }
    });

    const pendingTransfers = await prisma.transfer.count({
      where: { status: { in: ["DRAFT", "READY"] } }
    });

    return {
      totalProducts,
      totalStock: stockStats._sum.quantity || 0,
      lowStockProducts,
      outOfStockProducts,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers,
    };
  }

  async getRecentOperations() {
    const receipts = await prisma.receipt.findMany({
      where: { status: { in: ["DRAFT", "READY"] } },
      take: 5,
      orderBy: { updatedAt: "desc" },
    });

    const deliveries = await prisma.delivery.findMany({
      where: { status: { in: ["DRAFT", "WAITING", "READY"] } },
      take: 5,
      orderBy: { updatedAt: "desc" },
    });

    const transfers = await prisma.transfer.findMany({
      where: { status: { in: ["DRAFT", "READY"] } },
      take: 5,
      orderBy: { updatedAt: "desc" },
    });

    const ops = [
      ...receipts.map(r => ({ id: r.reference, type: "receipt", status: r.status.toLowerCase(), date: r.updatedAt })),
      ...deliveries.map(d => ({ id: d.reference, type: "delivery", status: d.status.toLowerCase(), date: d.updatedAt })),
      ...transfers.map(t => ({ id: t.reference, type: "transfer", status: t.status.toLowerCase(), date: t.updatedAt })),
    ];

    return ops.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }

  async getLowStockAlerts() {
    const stocks = await prisma.productStock.findMany({
      where: {
        quantity: { lt: 10 }
      },
      include: {
        product: {
          include: {
            reorderRules: true
          }
        },
        location: true
      },
      take: 5
    });

    return stocks.map(s => ({
      id: s.product.id,
      name: s.product.name,
      sku: s.product.sku,
      stock: s.quantity,
      minStock: s.product.reorderRules[0]?.minQuantity || 10,
      location: s.location.name
    }));
  }

  async getMovementsTrend() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const movements = await prisma.stockLedger.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: "asc" }
    });

    // Initialize trend data for last 7 days
    const trendMap = new Map();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      trendMap.set(dateKey, { name: dayName, in: 0, out: 0 });
    }

    movements.forEach(move => {
      const dateKey = move.createdAt.toISOString().split('T')[0];
      if (trendMap.has(dateKey)) {
        const current = trendMap.get(dateKey);
        if (move.quantity > 0) {
          current.in += move.quantity;
        } else {
          current.out += Math.abs(move.quantity);
        }
      }
    });

    return Array.from(trendMap.values());
  }

  async getStockByCategory() {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            stocks: true
          }
        }
      }
    });

    return categories.map(cat => ({
      name: cat.name,
      value: cat.products.reduce((acc, prod) => {
        return acc + prod.stocks.reduce((sAcc, s) => sAcc + s.quantity, 0);
      }, 0)
    })).filter(cat => cat.value > 0);
  }
}
