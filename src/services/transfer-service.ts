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
    const res = await fetch('/api/transfers');
    if (!res.ok) throw new Error('Failed to fetch transfers');
    return res.json();
  },

  async getById(id: string): Promise<Transfer | undefined> {
    const res = await fetch(`/api/transfers/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error('Failed to fetch transfer');
    }
    return res.json();
  },

  async create(data: TransferFormData): Promise<Transfer> {
    const res = await fetch('/api/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create transfer');
    return res.json();
  },

  async updateStatus(id: string, status: Transfer['status']): Promise<Transfer> {
    const endpoint = status === 'done' || status === 'ready'
      ? `/api/transfers/${id}/validate`
      : `/api/transfers/${id}`;

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`Failed to update transfer status to ${status}`);
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/transfers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete transfer');
  },
};
