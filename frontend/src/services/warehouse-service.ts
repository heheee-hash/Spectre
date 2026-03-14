import { Warehouse } from '@/types';
import { mockWarehouses } from '@/data';
import { simulateDelay } from './utils';

export const warehouseService = {
  async getAll(): Promise<Warehouse[]> {
    await simulateDelay(300);
    return [...mockWarehouses];
  },

  async getById(id: string): Promise<Warehouse | undefined> {
    await simulateDelay(200);
    return mockWarehouses.find((w) => w.id === id);
  },
};
