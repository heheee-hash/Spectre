import { NextResponse } from "next/server";
import { apiHandler, requireAuth, requireRole } from "@/server/helpers/api.helper";
import { CategoryService } from "@/server/services/product.service";

const categoryService = new CategoryService();

export const GET = apiHandler(async () => {
  await requireAuth();
  const categories = await categoryService.getCategories();
  return NextResponse.json(categories);
});

export const POST = apiHandler(async (req) => {
  await requireRole(["ADMIN", "MANAGER"]);
  const body = await req.json();
  const category = await categoryService.createCategory(body);
  return NextResponse.json(category, { status: 201 });
});
