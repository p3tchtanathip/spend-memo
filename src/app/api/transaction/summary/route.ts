import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/transaction/summary
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { category: true },
  });

  // Calculate summary
  const totalIncome = transactions.filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions.filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  // Month group
  const monthlyExpenses: { month: string, amount: number }[] = [];
  transactions
    .filter(t => t.type === "EXPENSE")
    .forEach(t => {
      const month = new Date(t.date).toLocaleString("th-TH", { month: "short" });
      const found = monthlyExpenses.find(m => m.month === month);
      if (found) found.amount += t.amount;
      else monthlyExpenses.push({ month, amount: t.amount });
    });

  // Category group
  const expensesByCategories: { name: string, value: number }[] = [];
  transactions
    .filter(t => t.type === "EXPENSE" && t.category)
    .forEach(t => {
      const name = t.category!.name;
      const found = expensesByCategories.find(c => c.name === name);
      if (found) found.value += t.amount;
      else expensesByCategories.push({ name, value: t.amount });
    });

  return NextResponse.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    monthlyExpenses,
    expensesByCategories,
    recentTransactions: transactions,
  });
}
