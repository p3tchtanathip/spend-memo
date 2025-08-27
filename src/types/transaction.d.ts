import { CategoryType } from "./category";
import { EntryType } from "./entry";
import { UserType } from "./user";

export type TransactionType = {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: EntryType;
  userId: string;
  categoryId: string;
  user?: UserType;
  category?: CategoryType;
}