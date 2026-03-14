import { BaseEntity } from './common';

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  category: string;
  description: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  reorderLevel: number;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  description: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  reorderLevel: number;
}

export const productCategories = [
  'Raw Materials',
  'Finished Goods',
  'Office Supplies',
  'Packaging',
  'Equipment',
] as const;

export const productUnits = [
  'pcs',
  'kg',
  'meters',
  'sheets',
  'boxes',
  'liters',
] as const;
