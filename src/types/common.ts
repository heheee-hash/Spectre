export type Status = 'draft' | 'waiting' | 'ready' | 'done' | 'cancelled' | 'confirmed';
export type OperationType = 'receipt' | 'delivery' | 'transfer' | 'adjustment';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface ActivityItem {
  id: string;
  type: OperationType | 'product';
  action: 'created' | 'updated' | 'deleted' | 'completed';
  entityId: string;
  entityName: string;
  description: string;
  user: string;
  timestamp: string;
}

export interface KPICard {
  title: string;
  value: number | string;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface ChartDataPoint {
  date: string;
  receipts: number;
  deliveries: number;
  transfers: number;
}
