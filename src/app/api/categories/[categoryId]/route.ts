import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { CategoryService } from "@/server/services/product.service";

const categoryService = new CategoryService();

export const PATCH = apiHandler(async (req, { params }: { params: { categoryId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const category = await categoryService.updateCategory(params.categoryId, body);
  return NextResponse.json(category);
});

export const DELETE = apiHandler(async (req, { params }: { params: { categoryId: string } }) => {
  await requireRole(["ADMIN", "MANAGER"]);
  await categoryService.deleteCategory(params.categoryId);
  return new NextResponse(null, { status: 204 });
});
