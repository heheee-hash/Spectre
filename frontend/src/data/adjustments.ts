import { Adjustment } from '@/types';

export const mockAdjustments: Adjustment[] = [
  {
    id: 'adj-001',
    reference: 'ADJ/2025/001',
    warehouseId: 'wh-001',
    warehouseName: 'Main Warehouse',
    date: '2025-03-08T08:00:00Z',
    status: 'done',
    lines: [
      { id: 'al-001', productId: 'prod-002', productName: 'Industrial Bolts', currentQty: 3500, newQty: 3400, difference: -100, reason: 'count_correction', unit: 'boxes' },
      { id: 'al-002', productId: 'prod-007', productName: 'Packing Tape', currentQty: 1850, newQty: 1800, difference: -50, reason: 'damage', unit: 'boxes' },
    ],
    notes: 'Monthly stock count adjustment',
    createdAt: '2025-03-08T08:00:00Z',
    updatedAt: '2025-03-08T12:00:00Z',
  },
  {
    id: 'adj-002',
    reference: 'ADJ/2025/002',
    warehouseId: 'wh-002',
    warehouseName: 'Production Floor',
    date: '2025-03-12T10:00:00Z',
    status: 'done',
    lines: [
      { id: 'al-003', productId: 'prod-001', productName: 'Steel Rods', currentQty: 1280, newQty: 1250, difference: -30, reason: 'quality_control', unit: 'pcs' },
    ],
    notes: 'QC rejection - rods below spec',
    createdAt: '2025-03-12T10:00:00Z',
    updatedAt: '2025-03-12T14:00:00Z',
  },
  {
    id: 'adj-003',
    reference: 'ADJ/2025/003',
    warehouseId: 'wh-003',
    warehouseName: 'Packing Zone',
    date: '2025-03-14T09:00:00Z',
    status: 'confirmed',
    lines: [
      { id: 'al-004', productId: 'prod-005', productName: 'Wood Panels', currentQty: 420, newQty: 410, difference: -10, reason: 'damage', unit: 'sheets' },
    ],
    notes: 'Water damage during storage',
    createdAt: '2025-03-14T09:00:00Z',
    updatedAt: '2025-03-14T09:00:00Z',
  },
];
