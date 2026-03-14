import { z } from "zod";

export const warehouseCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address: z.string().optional(),
});

export const warehouseUpdateSchema = warehouseCreateSchema.partial();
