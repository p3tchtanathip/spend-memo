import { EntryType } from "@/types/entry";

export interface CategoryDto {
  type: EntryType;
  name: string;
  icon: string;
}