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
    const res = await fetch('/api/adjustments');
    if (!res.ok) throw new Error('Failed to fetch adjustments');
    return res.json();
  },

  async getById(id: string): Promise<Adjustment | undefined> {
    const res = await fetch(`/api/adjustments/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error('Failed to fetch adjustment');
    }
    return res.json();
  },

  async create(data: AdjustmentFormData): Promise<Adjustment> {
    const res = await fetch('/api/adjustments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create adjustment');
    return res.json();
  },

  async updateStatus(id: string, status: Adjustment['status']): Promise<Adjustment> {
    const endpoint = status === 'done'
      ? `/api/adjustments/${id}/validate`
      : `/api/adjustments/${id}`;

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`Failed to update adjustment status to ${status}`);
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/adjustments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete adjustment');
  },
};
