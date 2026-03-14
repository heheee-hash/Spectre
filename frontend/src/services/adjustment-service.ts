import { Adjustment, AdjustmentFormData } from '@/types';
import { mockAdjustments } from '@/data';
import { mockProducts } from '@/data';
import { simulateDelay, generateId, generateReference } from './utils';

let adjustments = [...mockAdjustments];

const warehouseNameMap: Record<string, string> = {
  'wh-001': 'Main Warehouse',
  'wh-002': 'Production Floor',
  'wh-003': 'Packing Zone',
};

export const adjustmentService = {
  async getAll(): Promise<Adjustment[]> {
    await simulateDelay(300);
    return [...adjustments];
  },

  async getById(id: string): Promise<Adjustment | undefined> {
    await simulateDelay(200);
    return adjustments.find((a) => a.id === id);
  },

  async create(data: AdjustmentFormData): Promise<Adjustment> {
    await simulateDelay(400);
    const newAdjustment: Adjustment = {
      id: generateId('adj'),
      reference: generateReference('ADJ'),
      warehouseId: data.warehouseId,
      warehouseName: warehouseNameMap[data.warehouseId] || 'Unknown',
      date: data.date,
      status: 'draft',
      lines: data.lines.map((line, index) => {
        const product = mockProducts.find((p) => p.id === line.productId);
        const currentQty = product?.totalStock || 0;
        return {
          id: generateId('al'),
          productId: line.productId,
          productName: product?.name || `Product ${index + 1}`,
          currentQty,
          newQty: line.newQty,
          difference: line.newQty - currentQty,
          reason: line.reason,
          unit: product?.unit || 'pcs',
        };
      }),
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    adjustments = [newAdjustment, ...adjustments];
    return newAdjustment;
  },

  async updateStatus(id: string, status: Adjustment['status']): Promise<Adjustment> {
    await simulateDelay(300);
    const index = adjustments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Adjustment not found');
    adjustments[index] = {
      ...adjustments[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    return adjustments[index];
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(300);
    adjustments = adjustments.filter((a) => a.id !== id);
  },
};
