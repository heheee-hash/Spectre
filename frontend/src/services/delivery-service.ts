import { DeliveryOrder, DeliveryFormData } from '@/types';
import { mockDeliveries } from '@/data';
import { mockProducts } from '@/data';
import { simulateDelay, generateId, generateReference } from './utils';

let deliveries = [...mockDeliveries];

export const deliveryService = {
  async getAll(): Promise<DeliveryOrder[]> {
    await simulateDelay(300);
    return [...deliveries];
  },

  async getById(id: string): Promise<DeliveryOrder | undefined> {
    await simulateDelay(200);
    return deliveries.find((d) => d.id === id);
  },

  async create(data: DeliveryFormData): Promise<DeliveryOrder> {
    await simulateDelay(400);
    const newDelivery: DeliveryOrder = {
      id: generateId('del'),
      reference: generateReference('DEL'),
      customer: data.customer,
      warehouseId: data.warehouseId,
      warehouseName: data.warehouseId === 'wh-001' ? 'Main Warehouse' : data.warehouseId === 'wh-002' ? 'Production Floor' : 'Packing Zone',
      scheduledDate: data.scheduledDate,
      status: 'draft',
      lines: data.lines.map((line, index) => {
        const product = mockProducts.find((p) => p.id === line.productId);
        return {
          id: generateId('dl'),
          productId: line.productId,
          productName: product?.name || `Product ${index + 1}`,
          demandQty: line.demandQty,
          deliveredQty: 0,
          unit: product?.unit || 'pcs',
        };
      }),
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    deliveries = [newDelivery, ...deliveries];
    return newDelivery;
  },

  async updateStatus(id: string, status: DeliveryOrder['status']): Promise<DeliveryOrder> {
    await simulateDelay(300);
    const index = deliveries.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Delivery not found');
    deliveries[index] = {
      ...deliveries[index],
      status,
      completedDate: status === 'done' ? new Date().toISOString() : deliveries[index].completedDate,
      updatedAt: new Date().toISOString(),
    };
    return deliveries[index];
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(300);
    deliveries = deliveries.filter((d) => d.id !== id);
  },
};
