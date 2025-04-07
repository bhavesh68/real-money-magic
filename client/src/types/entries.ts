// types/entry.ts
export type Entry = {
    type: 'expense' | 'income';
    amount: number;
    category: string;
    note?: string;
    recurring: boolean;
    date?: string;
  };
  