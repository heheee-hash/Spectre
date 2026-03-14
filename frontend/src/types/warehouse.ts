import { BaseEntity } from './common';

export interface Warehouse extends BaseEntity {
  name: string;
  code: string;
  address: string;
  capacity: number;
  usedCapacity: number;
  manager: string;
  isActive: boolean;
  zones: WarehouseZone[];
}

export interface WarehouseZone {
  id: string;
  name: string;
  type: 'storage' | 'receiving' | 'shipping' | 'staging';
  capacity: number;
  usedCapacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StockByWarehouse {
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}
