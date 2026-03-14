import { z } from "zod";

export const locationCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["VENDOR", "CUSTOMER", "INTERNAL", "TRANSIT", "VIRTUAL"]).default("INTERNAL"),
  warehouseId: z.string().cuid("Invalid warehouse ID"),
});

export const locationUpdateSchema = locationCreateSchema.partial();
