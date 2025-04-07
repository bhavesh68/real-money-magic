import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { Entry } from '../types/entries'


interface TodaySummaryProps {
  totalExpenses: number;
  totalIncome: number;
  entries: Entry[];
  date: string;
}

const TodaySummary = ({ totalExpenses, totalIncome, entries, date }: TodaySummaryProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const expenseBreakdown: Record<string, number> = {};
  const incomeBreakdown: Record<string, number> = {};
  const categorizedExpenses: Record<string, Entry[]> = {};

  entries.forEach((entry) => {
    if (entry.type === 'expense') {
      expenseBreakdown[entry.category] = (expenseBreakdown[entry.category] || 0) + entry.amount;
      categorizedExpenses[entry.category] = categorizedExpenses[entry.category] || [];
      categorizedExpenses[entry.category].push(entry);
    } else if (entry.type === 'income') {
      const source = entry.note || 'Uncategorized';
      incomeBreakdown[source] = (incomeBreakdown[source] || 0) + entry.amount;
    }
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="bg-white border border-[#1D7E5F] rounded-2xl p-6 shadow-xl w-full max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-center text-[#1D7E5F] mb-4">
        📅 {dayjs(date).format('MMMM D, YYYY')}
      </h2>

      <h3 className="text-lg font-bold text-[#1D7E5F] mb-2">✨ Today’s Summary</h3>

      <div className="space-y-2">
        <p className="text-[#1D7E5F] font-semibold">💸 Total Expenses: ${totalExpenses.toFixed(2)}</p>
        <p className="text-[#1D7E5F] font-semibold">💰 Total Income: ${totalIncome.toFixed(2)}</p>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[#29AB87] hover:underline mt-2"
        >
          {showDetails ? 'Hide Breakdown ▲' : 'Show Breakdown ▼'}
        </button>

        {showDetails && (
          <div className="mt-2">
            <div className="mb-3">
              <p className="font-bold text-[#155D47] mb-1">Expenses by Category:</p>
              <ul className="text-sm text-[#1D7E5F]">
                {Object.entries(expenseBreakdown).map(([cat, amount]) => (
                  <li key={cat} className="mb-2">
                    <button
                      className="text-left w-full font-semibold hover:underline"
                      onClick={() => toggleCategory(cat)}
                    >
                      {expandedCategories[cat] ? '▼' : '▶'} {cat}: ${amount.toFixed(2)}
                    </button>
                    {expandedCategories[cat] && (
                      <ul className="ml-4 list-disc">
                        {categorizedExpenses[cat].map((entry, idx) => (
                          <li key={idx}>${entry.amount.toFixed(2)} {entry.note && `- ${entry.note}`}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold text-[#155D47] mb-1">Income by Source:</p>
              <ul className="list-disc list-inside text-sm text-[#1D7E5F]">
                {Object.entries(incomeBreakdown).map(([source, amount]) => (
                  <li key={source}>{source}: ${amount.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaySummary;
