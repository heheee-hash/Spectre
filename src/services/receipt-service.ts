import { Receipt, ReceiptFormData } from '@/types';
import { mockReceipts } from '@/data';
import { mockProducts } from '@/data';
import { simulateDelay, generateId, generateReference } from './utils';

let receipts = [...mockReceipts];

export const receiptService = {
  async getAll(): Promise<Receipt[]> {
    const res = await fetch('/api/receipts');
    if (!res.ok) throw new Error('Failed to fetch receipts');
    return res.json();
  },

  async getById(id: string): Promise<Receipt | undefined> {
    const res = await fetch(`/api/receipts/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error('Failed to fetch receipt');
    }
    return res.json();
  },

  async create(data: ReceiptFormData): Promise<Receipt> {
    const res = await fetch('/api/receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create receipt');
    return res.json();
  },

  async updateStatus(id: string, status: Receipt['status']): Promise<Receipt> {
    const endpoint = status === 'done' || status === 'ready' 
      ? `/api/receipts/${id}/validate` 
      : `/api/receipts/${id}`;
    
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`Failed to update receipt status to ${status}`);
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/receipts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete receipt');
  },
};
