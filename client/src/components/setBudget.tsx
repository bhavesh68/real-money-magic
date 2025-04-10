import React, { useState, useEffect } from 'react';

interface SetBudgetProps {
  projectId: string;
  onSave: (budget: { total: number }) => void;
}

const SetBudget: React.FC<SetBudgetProps> = ({ onSave, projectId }) => {
  const [amount, setAmount] = useState(() => {
    const stored = localStorage.getItem('monthlyBudget');
    return stored ? parseFloat(stored) : '';
  });

  useEffect(() => {
    // Update local storage whenever amount changes
    if (typeof amount === 'number' && !isNaN(amount)) {
      localStorage.setItem('monthlyBudget', amount.toString());
    }
  }, [amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount.toString());
    if (!isNaN(parsed)) {
      localStorage.setItem('monthlyBudget', parsed.toString());
      onSave({ total: parsed });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#29AB87] rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-[#1D7E5F] mb-4">Set Your Monthly Budget</h2>

      <label className="block text-[#1D7E5F] font-semibold mb-2">
        Total Budget Amount ($)
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="w-full border border-[#29AB87] rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
      />

      <button
        type="submit"
        className="bg-[#29AB87] hover:bg-[#218F71] text-white font-bold py-2 px-4 rounded-full transition"
      >
        Save Budget
      </button>
    </form>
  );
};

export default SetBudget;
