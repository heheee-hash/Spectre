import { Transfer, TransferFormData } from '@/types';
import { mockTransfers } from '@/data';
import { mockProducts } from '@/data';
import { simulateDelay, generateId, generateReference } from './utils';

let transfers = [...mockTransfers];

const warehouseNameMap: Record<string, string> = {
  'wh-001': 'Main Warehouse',
  'wh-002': 'Production Floor',
  'wh-003': 'Packing Zone',
};

export const transferService = {
  async getAll(): Promise<Transfer[]> {
    await simulateDelay(300);
    return [...transfers];
  },

  async getById(id: string): Promise<Transfer | undefined> {
    await simulateDelay(200);
    return transfers.find((t) => t.id === id);
  },

  async create(data: TransferFormData): Promise<Transfer> {
    await simulateDelay(400);
    const newTransfer: Transfer = {
      id: generateId('trn'),
      reference: generateReference('TRN'),
      sourceWarehouseId: data.sourceWarehouseId,
      sourceWarehouseName: warehouseNameMap[data.sourceWarehouseId] || 'Unknown',
      destinationWarehouseId: data.destinationWarehouseId,
      destinationWarehouseName: warehouseNameMap[data.destinationWarehouseId] || 'Unknown',
      scheduledDate: data.scheduledDate,
      status: 'draft',
      lines: data.lines.map((line, index) => {
        const product = mockProducts.find((p) => p.id === line.productId);
        return {
          id: generateId('tl'),
          productId: line.productId,
          productName: product?.name || `Product ${index + 1}`,
          quantity: line.quantity,
          unit: product?.unit || 'pcs',
        };
      }),
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transfers = [newTransfer, ...transfers];
    return newTransfer;
  },

  async updateStatus(id: string, status: Transfer['status']): Promise<Transfer> {
    await simulateDelay(300);
    const index = transfers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Transfer not found');
    transfers[index] = {
      ...transfers[index],
      status,
      completedDate: status === 'done' ? new Date().toISOString() : transfers[index].completedDate,
      updatedAt: new Date().toISOString(),
    };
    return transfers[index];
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(300);
    transfers = transfers.filter((t) => t.id !== id);
  },
};
