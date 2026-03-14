import { Receipt, ReceiptFormData } from '@/types';
import { mockReceipts } from '@/data';
import { mockProducts } from '@/data';
import { simulateDelay, generateId, generateReference } from './utils';

let receipts = [...mockReceipts];

export const receiptService = {
  async getAll(): Promise<Receipt[]> {
    await simulateDelay(300);
    return [...receipts];
  },

  async getById(id: string): Promise<Receipt | undefined> {
    await simulateDelay(200);
    return receipts.find((r) => r.id === id);
  },

  async create(data: ReceiptFormData): Promise<Receipt> {
    await simulateDelay(400);
    const newReceipt: Receipt = {
      id: generateId('rec'),
      reference: generateReference('REC'),
      supplier: data.supplier,
      warehouseId: data.warehouseId,
      warehouseName: data.warehouseId === 'wh-001' ? 'Main Warehouse' : data.warehouseId === 'wh-002' ? 'Production Floor' : 'Packing Zone',
      scheduledDate: data.scheduledDate,
      status: 'draft',
      lines: data.lines.map((line, index) => {
        const product = mockProducts.find((p) => p.id === line.productId);
        return {
          id: generateId('rl'),
          productId: line.productId,
          productName: product?.name || `Product ${index + 1}`,
          expectedQty: line.expectedQty,
          receivedQty: 0,
          unit: product?.unit || 'pcs',
        };
      }),
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    receipts = [newReceipt, ...receipts];
    return newReceipt;
  },

  async updateStatus(id: string, status: Receipt['status']): Promise<Receipt> {
    await simulateDelay(300);
    const index = receipts.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Receipt not found');
    receipts[index] = {
      ...receipts[index],
      status,
      completedDate: status === 'done' ? new Date().toISOString() : receipts[index].completedDate,
      updatedAt: new Date().toISOString(),
    };
    return receipts[index];
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(300);
    receipts = receipts.filter((r) => r.id !== id);
  },
};
