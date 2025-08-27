import { EntryType } from "@/types/entry";

export interface TransactionDto {
  amount: number;
  description: string;
  date: Date;
  type: EntryType;
  categoryId: number;
}