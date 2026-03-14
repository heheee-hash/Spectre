import { DeliveryOrder, DeliveryFormData } from '@/types';
import { mockDeliveries } from '@/data';
import { mockProducts } from '@/data';
import { simulateDelay, generateId, generateReference } from './utils';

let deliveries = [...mockDeliveries];

export const deliveryService = {
  async getAll(): Promise<DeliveryOrder[]> {
    const res = await fetch('/api/deliveries');
    if (!res.ok) throw new Error('Failed to fetch deliveries');
    return res.json();
  },

  async getById(id: string): Promise<DeliveryOrder | undefined> {
    const res = await fetch(`/api/deliveries/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error('Failed to fetch delivery');
    }
    return res.json();
  },

  async create(data: DeliveryFormData): Promise<DeliveryOrder> {
    const res = await fetch('/api/deliveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create delivery');
    return res.json();
  },

  async updateStatus(id: string, status: DeliveryOrder['status']): Promise<DeliveryOrder> {
    const endpoint = status === 'done' || status === 'ready'
      ? `/api/deliveries/${id}/validate`
      : `/api/deliveries/${id}`;

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`Failed to update delivery status to ${status}`);
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/deliveries/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete delivery');
  },
};
