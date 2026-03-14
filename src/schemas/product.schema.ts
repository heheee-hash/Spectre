import { z } from "zod";

export const productCreateSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0).default(0),
  cost: z.number().min(0).default(0),
  categoryId: z.string().cuid("Invalid category ID").optional().nullable(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();
