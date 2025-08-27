import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/transaction
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: { category: true },
  });

  return NextResponse.json(transactions);
}

// POST /api/transaction
export async function POST(req: Request) {
  const { amount, type, description, date, categoryId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!type || !amount) {
    return NextResponse.json({ error: "userId, type, amount are required" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      description,
      date: date ? new Date(date) : new Date(),
      userId: session.user.id,
      categoryId: categoryId || null,
    },
  });

  return NextResponse.json(transaction);
}
