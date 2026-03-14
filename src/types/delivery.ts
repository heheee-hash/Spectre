import { BaseEntity, Status } from './common';

export interface DeliveryLine {
  id: string;
  productId: string;
  productName: string;
  demandQty: number;
  deliveredQty: number;
  unit: string;
}

export interface DeliveryOrder extends BaseEntity {
  reference: string;
  customer: string;
  warehouseId: string;
  warehouseName: string;
  scheduledDate: string;
  completedDate?: string;
  status: Status;
  lines: DeliveryLine[];
  notes?: string;
}

export interface DeliveryFormData {
  customer: string;
  warehouseId: string;
  scheduledDate: string;
  notes?: string;
  lines: {
    productId: string;
    demandQty: number;
  }[];
}
