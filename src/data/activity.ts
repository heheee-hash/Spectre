import { ActivityItem, ChartDataPoint } from '@/types';

export const mockActivity: ActivityItem[] = [
  { id: 'act-001', type: 'receipt', action: 'completed', entityId: 'rec-001', entityName: 'REC/2025/001', description: 'Receipt from SteelCorp Industries completed', user: 'Sarah Johnson', timestamp: '2025-03-10T14:30:00Z' },
  { id: 'act-002', type: 'delivery', action: 'completed', entityId: 'del-001', entityName: 'DEL/2025/001', description: 'Delivery to BuildRight Construction shipped', user: 'Lisa Park', timestamp: '2025-03-11T16:00:00Z' },
  { id: 'act-003', type: 'transfer', action: 'completed', entityId: 'trn-001', entityName: 'TRN/2025/001', description: 'Transfer to Production Floor completed', user: 'Michael Chen', timestamp: '2025-03-10T12:00:00Z' },
  { id: 'act-004', type: 'adjustment', action: 'created', entityId: 'adj-002', entityName: 'ADJ/2025/002', description: 'Inventory adjustment for QC rejection', user: 'Michael Chen', timestamp: '2025-03-12T10:00:00Z' },
  { id: 'act-005', type: 'receipt', action: 'completed', entityId: 'rec-002', entityName: 'REC/2025/002', description: 'AluTech aluminum sheets received', user: 'Sarah Johnson', timestamp: '2025-03-12T11:00:00Z' },
  { id: 'act-006', type: 'product', action: 'updated', entityId: 'prod-006', entityName: 'Copper Wire', description: 'Product details updated', user: 'Admin', timestamp: '2025-03-13T15:00:00Z' },
  { id: 'act-007', type: 'delivery', action: 'completed', entityId: 'del-004', entityName: 'DEL/2025/004', description: 'Wood panels delivered to WoodCraft Studio', user: 'Lisa Park', timestamp: '2025-03-14T17:00:00Z' },
  { id: 'act-008', type: 'transfer', action: 'created', entityId: 'trn-004', entityName: 'TRN/2025/004', description: 'New transfer draft for copper wire', user: 'Sarah Johnson', timestamp: '2025-03-14T09:00:00Z' },
  { id: 'act-009', type: 'receipt', action: 'created', entityId: 'rec-004', entityName: 'REC/2025/004', description: 'Draft receipt for Q2 supplies', user: 'Admin', timestamp: '2025-03-13T09:00:00Z' },
  { id: 'act-010', type: 'adjustment', action: 'created', entityId: 'adj-003', entityName: 'ADJ/2025/003', description: 'Adjustment for water damaged panels', user: 'Lisa Park', timestamp: '2025-03-14T09:00:00Z' },
];

export const mockChartData: ChartDataPoint[] = [
  { date: '2025-03-01', receipts: 3, deliveries: 2, transfers: 1 },
  { date: '2025-03-02', receipts: 1, deliveries: 3, transfers: 2 },
  { date: '2025-03-03', receipts: 4, deliveries: 1, transfers: 0 },
  { date: '2025-03-04', receipts: 2, deliveries: 4, transfers: 3 },
  { date: '2025-03-05', receipts: 5, deliveries: 2, transfers: 1 },
  { date: '2025-03-06', receipts: 3, deliveries: 5, transfers: 2 },
  { date: '2025-03-07', receipts: 2, deliveries: 3, transfers: 4 },
  { date: '2025-03-08', receipts: 6, deliveries: 2, transfers: 1 },
  { date: '2025-03-09', receipts: 1, deliveries: 4, transfers: 3 },
  { date: '2025-03-10', receipts: 4, deliveries: 3, transfers: 2 },
  { date: '2025-03-11', receipts: 3, deliveries: 6, transfers: 1 },
  { date: '2025-03-12', receipts: 5, deliveries: 2, transfers: 4 },
  { date: '2025-03-13', receipts: 2, deliveries: 4, transfers: 2 },
  { date: '2025-03-14', receipts: 4, deliveries: 3, transfers: 3 },
];

export interface StockLedgerEntry {
  id: string;
  date: string;
  productId: string;
  productName: string;
  operationType: 'receipt' | 'delivery' | 'transfer_in' | 'transfer_out' | 'adjustment';
  reference: string;
  warehouseName: string;
  quantityChange: number;
  balanceAfter: number;
}

export const mockStockLedger: StockLedgerEntry[] = [
  { id: 'sl-001', date: '2025-03-10T08:00:00Z', productId: 'prod-001', productName: 'Steel Rods', operationType: 'receipt', reference: 'REC/2025/001', warehouseName: 'Main Warehouse', quantityChange: 500, balanceAfter: 1250 },
  { id: 'sl-002', date: '2025-03-10T12:00:00Z', productId: 'prod-001', productName: 'Steel Rods', operationType: 'transfer_out', reference: 'TRN/2025/001', warehouseName: 'Main Warehouse', quantityChange: -150, balanceAfter: 1100 },
  { id: 'sl-003', date: '2025-03-10T12:00:00Z', productId: 'prod-001', productName: 'Steel Rods', operationType: 'transfer_in', reference: 'TRN/2025/001', warehouseName: 'Production Floor', quantityChange: 150, balanceAfter: 150 },
  { id: 'sl-004', date: '2025-03-11T09:00:00Z', productId: 'prod-001', productName: 'Steel Rods', operationType: 'delivery', reference: 'DEL/2025/001', warehouseName: 'Main Warehouse', quantityChange: -200, balanceAfter: 900 },
  { id: 'sl-005', date: '2025-03-10T08:00:00Z', productId: 'prod-002', productName: 'Industrial Bolts', operationType: 'receipt', reference: 'REC/2025/001', warehouseName: 'Main Warehouse', quantityChange: 980, balanceAfter: 3480 },
  { id: 'sl-006', date: '2025-03-08T08:00:00Z', productId: 'prod-002', productName: 'Industrial Bolts', operationType: 'adjustment', reference: 'ADJ/2025/001', warehouseName: 'Main Warehouse', quantityChange: -100, balanceAfter: 3400 },
  { id: 'sl-007', date: '2025-03-12T09:00:00Z', productId: 'prod-003', productName: 'Aluminum Sheets', operationType: 'receipt', reference: 'REC/2025/002', warehouseName: 'Main Warehouse', quantityChange: 200, balanceAfter: 320 },
  { id: 'sl-008', date: '2025-03-14T14:00:00Z', productId: 'prod-005', productName: 'Wood Panels', operationType: 'delivery', reference: 'DEL/2025/004', warehouseName: 'Packing Zone', quantityChange: -80, balanceAfter: 330 },
  { id: 'sl-009', date: '2025-03-12T10:00:00Z', productId: 'prod-005', productName: 'Wood Panels', operationType: 'transfer_out', reference: 'TRN/2025/002', warehouseName: 'Production Floor', quantityChange: -60, balanceAfter: 350 },
  { id: 'sl-010', date: '2025-03-12T10:00:00Z', productId: 'prod-005', productName: 'Wood Panels', operationType: 'transfer_in', reference: 'TRN/2025/002', warehouseName: 'Packing Zone', quantityChange: 60, balanceAfter: 410 },
  { id: 'sl-011', date: '2025-03-08T08:00:00Z', productId: 'prod-007', productName: 'Packing Tape', operationType: 'adjustment', reference: 'ADJ/2025/001', warehouseName: 'Main Warehouse', quantityChange: -50, balanceAfter: 1800 },
  { id: 'sl-012', date: '2025-03-12T10:00:00Z', productId: 'prod-001', productName: 'Steel Rods', operationType: 'adjustment', reference: 'ADJ/2025/002', warehouseName: 'Production Floor', quantityChange: -30, balanceAfter: 120 },
];
