import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT /api/category/:id
export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  const { name, type, icon } = await req.json();
  if (!name || !type || !icon) {
    return NextResponse.json({ error: "name, type, icon are required" }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: { name, type, icon }
  });

  return NextResponse.json(category);
}

// DELETE /api/category/:id
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Category not found or already deleted" }, { status: 404 });
  }
}
