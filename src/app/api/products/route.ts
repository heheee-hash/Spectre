import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { ProductService } from "@/server/services/product.service";

const productService = new ProductService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const products = await productService.getProducts();
  return NextResponse.json(products);
});

export const POST = apiHandler(async (req) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const product = await productService.createProduct(body);
  return NextResponse.json(product, { status: 201 });
});
