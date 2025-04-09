// Input.tsx
import React, { useState } from 'react';
import type { Entry } from '../types/entries';

interface InputProps {
  onAddEntry?: (entry: Entry) => void;
}

const Input = ({ onAddEntry }: InputProps) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const newEntry: Entry = {
      type,
      amount: numericAmount,
      category,
      note,
      recurring,
    };

    onAddEntry?.(newEntry);

    setAmount('');
    setNote('');
    setRecurring(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-6 w-full space-y-4 border border-[#1D7E5F]"
    >
      {/* Type & Amount */}
      <div className="flex flex-col md:flex-row gap-3">
      {/* Type */}
      <div className="flex flex-col w-full">
        <label htmlFor="entry-type" className="text-sm font-semibold text-[#1D7E5F]">Type</label>
        <select
          id="entry-type"
          value={type}
          onChange={(e) => setType(e.target.value as 'expense' | 'income')}
          className="border border-[#1D7E5F] rounded-md px-3 py-2 text-sm text-[#1D7E5F] w-full"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* Amount */}
      <div className="flex flex-col w-full">
        <label htmlFor="entry-amount" className="text-sm font-semibold text-[#1D7E5F]">Amount</label>
        <input
          id="entry-amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
        />
      </div>
    </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label htmlFor="type" className="text-sm font-semibold text-[#1D7E5F]">Category</label>
        <select
          id="type"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="food">Food</option>
          <option value="gas">Gas</option>
          <option value="rent">Rent</option>
          <option value="clothes">Clothes</option>
          <option value="recreation">Recreation</option>
          <option value="utilities">Utilities</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Optional Note */}
      <input
        type="text"
        placeholder="Optional note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      {/* Recurring */}
      <div className="flex items-center gap-2">
        <input
          id="recurring"
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="recurring" className="text-sm text-[#1D7E5F]">
          Recurring monthly
        </label>
      </div>

      <button
        type="submit"
        className="bg-[#29AB87] hover:bg-[#218F71] text-white px-4 py-2 rounded-full font-semibold text-sm w-full"
      >
        ➕ Save Entry
      </button>
    </form>
  );
};

export default Input;

