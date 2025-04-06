import { useState } from 'react';

type Entry = {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  note?: string;
  recurring: boolean;
};

const defaultEntry: Entry = {
  type: 'expense',
  amount: 0,
  category: '',
  note: '',
  recurring: false,
};

const categories = [
  'food', 'dining out', 'gas', 'rent', 'utilities',
  'clothes', 'recreation', 'repair', 'other',
];

const Input = ({ date = new Date().toISOString().split('T')[0] }: { date?: string }) => {
  const [entries, setEntries] = useState<Entry[]>([ { ...defaultEntry } ]);

  const handleChange = (index: number, field: keyof Entry, value: any) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: field === 'amount' ? parseFloat(value) : value,
    };
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { ...defaultEntry }]);
  };

  const totalExpenses = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting entries:', entries);
    // Eventually: send to backend or update calendar events
  };

  return (
    <div className="bg-white/80 p-6 rounded-xl shadow-xl max-w-xl w-full mx-auto">
      <h2 className="text-2xl font-bold text-[#1D7E5F] mb-4 text-center">
        ✨ Daily Entry for {date}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between gap-4">
              <select
                value={entry.type}
                onChange={(e) => handleChange(i, 'type', e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={entry.amount}
                onChange={(e) => handleChange(i, 'amount', e.target.value)}
                className="w-32 p-2 border rounded-lg"
              />

              <select
                value={entry.category}
                onChange={(e) => handleChange(i, 'category', e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder={entry.type === 'income' ? 'Source (optional)' : 'Note (optional)'}
              value={entry.note}
              onChange={(e) => handleChange(i, 'note', e.target.value)}
              className="w-full p-2 border rounded-lg"
            />

            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={entry.recurring}
                onChange={(e) => handleChange(i, 'recurring', e.target.checked)}
              />
              <span>Recurring monthly</span>
            </label>
          </div>
        ))}

        <div className="flex justify-between text-sm font-medium text-gray-700">
          <p>💸 Total Expenses: <span className="text-[#A72608]">${totalExpenses.toFixed(2)}</span></p>
          <p>💰 Total Income: <span className="text-[#1D7E5F]">${totalIncome.toFixed(2)}</span></p>
        </div>

        <button
          type="button"
          onClick={addEntry}
          className="w-full bg-[#29AB87] text-white py-2 rounded-xl hover:bg-[#218F71] transition"
        >
          ＋ Add Another Entry
        </button>

        <button
          type="submit"
          className="w-full mt-2 bg-[#1D7E5F] text-white py-2 rounded-xl hover:bg-[#155D47] transition"
        >
          Save Entries
        </button>
      </form>
    </div>
  );
};

export default Input;
