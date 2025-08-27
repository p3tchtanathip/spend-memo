import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";

// GET /api/category or /api/category?type=INCOME
export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") as TransactionType | null;

  const where = type ? { type } : undefined;

  const categories = await prisma.category.findMany({
    where,
    orderBy: { id: "desc" }
  });

  return NextResponse.json(categories);
}

// POST /api/category
export async function POST(req: Request) {
  const { name, type, icon } = await req.json();
  if (!name || !type || !icon) {
    return NextResponse.json({ error: "name, type, icon are required" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name, type, icon }
  });

  return NextResponse.json(category);
}
