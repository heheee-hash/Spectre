import { BaseEntity, Status } from './common';

export interface TransferLine {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface Transfer extends BaseEntity {
  reference: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  scheduledDate: string;
  completedDate?: string;
  status: Status;
  lines: TransferLine[];
  notes?: string;
}

export interface TransferFormData {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  scheduledDate: string;
  notes?: string;
  lines: {
    productId: string;
    quantity: number;
  }[];
}
