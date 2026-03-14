import { PrismaClient, DocumentStatus } from "@prisma/client";
import { ReceiptService } from "../src/server/services/receipt.service";
import { DeliveryService } from "../src/server/services/delivery.service";
import { TransferService } from "../src/server/services/transfer.service";
import { AdjustmentService } from "../src/server/services/adjustment.service";

const prisma = new PrismaClient();
const receiptService = new ReceiptService();
const deliveryService = new DeliveryService();
const transferService = new TransferService();
const adjustmentService = new AdjustmentService();

async function main() {
  console.log("🚀 Starting Inventory Logic Verification...");

  try {
    // 1. Setup: Get a user and locations
    const user = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!user) throw new Error("No ADMIN user found");

    const wh1 = await prisma.location.findFirst({ where: { type: "INTERNAL" } });
    const wh2 = await prisma.location.findFirst({ where: { type: "INTERNAL", id: { not: wh1?.id } } });
    
    if (!wh1 || !wh2) throw new Error("Need at least two internal locations");

    // 2. Create a test product
    const sku = `TEST-PROD-${Date.now()}`;
    const product = await prisma.product.create({
      data: {
        name: "Verification Test Product",
        sku,
        uom: "units",
        categoryId: (await prisma.category.findFirst())?.id || "",
      }
    });
    console.log(`✅ Product created: ${product.name} (${sku})`);

    // 3. Perform a Receipt (Stock In)
    const receipt = await receiptService.createReceipt({
      destinationId: wh1.id,
      items: [{ productId: product.id, quantity: 100 }],
      notes: "Initial stock for verification"
    }, user.id);
    
    await receiptService.validateReceipt(receipt.id);
    console.log("✅ Receipt validated (+100 units)");

    // Verify stock at WH1
    const stockAtWh1 = await prisma.productStock.findUnique({
      where: { productId_locationId: { productId: product.id, locationId: wh1.id } }
    });
    console.log(`📊 WH1 Stock: ${stockAtWh1?.quantity}`);

    // 4. Perform a Transfer (WH1 -> WH2)
    const transfer = await transferService.createTransfer({
      sourceId: wh1.id,
      destinationId: wh2.id,
      items: [{ productId: product.id, quantity: 40 }],
      notes: "Moving stock for verification"
    }, user.id);

    await transferService.validateTransfer(transfer.id);
    console.log("✅ Transfer validated (40 units WH1 -> WH2)");

    // Verify stock at both
    const stock1 = await prisma.productStock.findUnique({
      where: { productId_locationId: { productId: product.id, locationId: wh1.id } }
    });
    const stock2 = await prisma.productStock.findUnique({
      where: { productId_locationId: { productId: product.id, locationId: wh2.id } }
    });
    console.log(`📊 WH1 Stock: ${stock1?.quantity}, WH2 Stock: ${stock2?.quantity}`);

    // 5. Perform a Delivery (Stock Out from WH2)
    const delivery = await deliveryService.createDelivery({
      sourceId: wh2.id,
      items: [{ productId: product.id, quantity: 10 }],
      notes: "Selling stock for verification"
    }, user.id);

    await deliveryService.validateDelivery(delivery.id);
    console.log("✅ Delivery validated (-10 units from WH2)");

    const finalStock2 = await prisma.productStock.findUnique({
      where: { productId_locationId: { productId: product.id, locationId: wh2.id } }
    });
    console.log(`📊 WH2 Final Stock: ${finalStock2?.quantity}`);

    // 6. Perform an Adjustment (Correction at WH1: 60 -> 65)
    const adjustment = await adjustmentService.createAdjustment({
      locationId: wh1.id,
      items: [{ productId: product.id, countedQty: 65, systemQty: 60 }],
      reason: "Inventory correction"
    }, user.id);

    await adjustmentService.validateAdjustment(adjustment.id);
    console.log("✅ Adjustment validated (+5 variance at WH1)");

    const adjustedStock1 = await prisma.productStock.findUnique({
      where: { productId_locationId: { productId: product.id, locationId: wh1.id } }
    });
    console.log(`📊 WH1 Adjusted Stock: ${adjustedStock1?.quantity}`);

    // 7. Check Ledger
    const ledgerEntries = await prisma.stockLedger.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "asc" }
    });
    console.log(`📝 Ledger entries found: ${ledgerEntries.length}`);
    ledgerEntries.forEach(entry => {
      console.log(`   - ${entry.documentType}: ${entry.quantity > 0 ? "+" : ""}${entry.quantity}`);
    });

    console.log("\n✨ Verification Complete! Everything looks correct.");

  } catch (error) {
    console.error("❌ Verification Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
