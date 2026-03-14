import { Product, ProductFormData } from '@/types';
import { mockProducts } from '@/data';
import { simulateDelay, generateId } from './utils';

let products = [...mockProducts];

export const productService = {
  async getAll(): Promise<Product[]> {
    await simulateDelay(300);
    return [...products];
  },

  async getById(id: string): Promise<Product | undefined> {
    await simulateDelay(200);
    return products.find((p) => p.id === id);
  },

  async create(data: ProductFormData): Promise<Product> {
    await simulateDelay(400);
    const newProduct: Product = {
      ...data,
      id: generateId('prod'),
      totalStock: 0,
      reservedStock: 0,
      availableStock: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products = [newProduct, ...products];
    return newProduct;
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    await simulateDelay(400);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
    return products[index];
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(300);
    products = products.filter((p) => p.id !== id);
  },
};
