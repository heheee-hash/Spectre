import { BaseEntity, Status } from './common';

export type AdjustmentReason =
  | 'damage'
  | 'theft'
  | 'count_correction'
  | 'expiry'
  | 'quality_control'
  | 'other';

export interface AdjustmentLine {
  id: string;
  productId: string;
  productName: string;
  currentQty: number;
  newQty: number;
  difference: number;
  reason: AdjustmentReason;
  unit: string;
}

export interface Adjustment extends BaseEntity {
  reference: string;
  warehouseId: string;
  warehouseName: string;
  date: string;
  status: Status;
  lines: AdjustmentLine[];
  notes?: string;
}

export interface AdjustmentFormData {
  warehouseId: string;
  date: string;
  notes?: string;
  lines: {
    productId: string;
    newQty: number;
    reason: AdjustmentReason;
  }[];
}
