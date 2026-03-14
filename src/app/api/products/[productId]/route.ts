import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { ProductService } from "@/server/services/product.service";

const productService = new ProductService();

export const GET = apiHandler(async (req, { params }: { params: { productId: string } }) => {
  await requireAuth();
  const product = await productService.getProductById(params.productId);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
});

export const PATCH = apiHandler(async (req, { params }: { params: { productId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const product = await productService.updateProduct(params.productId, body);
  return NextResponse.json(product);
});

export const DELETE = apiHandler(async (req, { params }: { params: { productId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  await productService.deleteProduct(params.productId);
  return new NextResponse(null, { status: 204 });
});
