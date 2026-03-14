import { BaseEntity, Status } from './common';

export interface ReceiptLine {
  id: string;
  productId: string;
  productName: string;
  expectedQty: number;
  receivedQty: number;
  unit: string;
}

export interface Receipt extends BaseEntity {
  reference: string;
  supplier: string;
  warehouseId: string;
  warehouseName: string;
  scheduledDate: string;
  completedDate?: string;
  status: Status;
  lines: ReceiptLine[];
  notes?: string;
}

export interface ReceiptFormData {
  supplier: string;
  warehouseId: string;
  scheduledDate: string;
  notes?: string;
  lines: {
    productId: string;
    expectedQty: number;
  }[];
}
