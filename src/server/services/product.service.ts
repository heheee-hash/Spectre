import { ProductRepository, CategoryRepository } from "../repositories/product.repository";
import { productCreateSchema, productUpdateSchema, categoryCreateSchema, categoryUpdateSchema } from "@/schemas/product.schema";

const productRepo = new ProductRepository();
const categoryRepo = new CategoryRepository();

export class ProductService {
  async getProducts() {
    return productRepo.findAll({
      orderBy: { createdAt: "desc" },
    });
  }

  async getProductById(id: string) {
    return productRepo.findById(id);
  }

  async createProduct(data: any) {
    const validatedData = productCreateSchema.parse(data);
    return productRepo.create(validatedData as any);
  }

  async updateProduct(id: string, data: any) {
    const validatedData = productUpdateSchema.parse(data);
    return productRepo.update(id, validatedData as any);
  }

  async deleteProduct(id: string) {
    return productRepo.delete(id);
  }
}

export class CategoryService {
  async getCategories() {
    return categoryRepo.findAll();
  }

  async createCategory(data: any) {
    const validatedData = categoryCreateSchema.parse(data);
    return categoryRepo.create(validatedData);
  }

  async updateCategory(id: string, data: any) {
    const validatedData = categoryUpdateSchema.parse(data);
    return categoryRepo.update(id, validatedData);
  }

  async deleteCategory(id: string) {
    return categoryRepo.delete(id);
  }
}
