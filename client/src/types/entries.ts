// types/entry.ts
export type Entry = {
    type: 'expense' | 'income' | 'stress';
    amount: number;
    category: string;
    note?: string;
    recurring: boolean;
    date?: string;
  };
  