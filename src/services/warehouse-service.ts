import { Warehouse } from '@/types';
import { mockWarehouses } from '@/data';
import { simulateDelay } from './utils';

export const warehouseService = {
  async getAll(): Promise<Warehouse[]> {
    const res = await fetch('/api/warehouses');
    if (!res.ok) throw new Error('Failed to fetch warehouses');
    return res.json();
  },

  async getById(id: string): Promise<Warehouse | undefined> {
    const res = await fetch(`/api/warehouses/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error('Failed to fetch warehouse');
    }
    return res.json();
  },
};
