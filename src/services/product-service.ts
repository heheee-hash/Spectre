import { Product, ProductFormData } from '@/types';
import { mockProducts } from '@/data';
import { simulateDelay, generateId } from './utils';

let products = [...mockProducts];

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getById(id: string): Promise<Product | undefined> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error('Failed to fetch product');
    }
    return res.json();
  },

  async create(data: ProductFormData): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },
};
