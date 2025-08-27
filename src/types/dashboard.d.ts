import { EntryType } from "./entry";
import { TransactionType } from "./transaction";

type MonthlyExpense = {
  month: string; 
  amount: number;
}

export type expensesByCategory = {
  name: string; 
  value: number; 
  color?: string;
}

export type DashboardType = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyExpenses: MonthlyExpense[];
  expensesByCategories: expensesByCategory[];
  recentTransactions: TransactionType[];
}