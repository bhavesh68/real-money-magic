import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Entry } from '../types/entries';
import { stripTypenameDeep } from '../utils/stripTypename';
import type { CalendarEntry } from '../types/entries';

interface TodaySummaryProps {
  totalExpenses: number;
  totalIncome: number;
  entries: Entry[];
  date: string;
  stressLevel?: '😊' | '🥺' | '🤯';
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  saveCalendarData: (data: CalendarEntry[]) => Promise<void>;
  budgetData?: {
    category: string;
    amount: number;
    note?: string;
  }[];
  monthlyBudget: number; // ✅ FIXED!
}

const TodaySummary = ({ 
  totalExpenses,
  totalIncome,
  entries,
  date,
  stressLevel,
  setEntries,
  saveCalendarData,
  budgetData,
  monthlyBudget,
}: TodaySummaryProps) => {

  const [showDetails, setShowDetails] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const selectedMonth = dayjs(date).format('YYYY-MM');

  const incomeEntriesThisMonth = entries.filter((e) => {
    return e.type === 'income' && e.date?.startsWith(selectedMonth);
  });
  
  const seen = new Set<string>();
  const dedupedIncome = incomeEntriesThisMonth.filter((e) => {
    const key = `${e.note}-${e.amount}-${e.category}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  const monthlyIncome = dedupedIncome.reduce((sum, e) => sum + e.amount, 0);

  const monthlyExpenses = entries
    .filter((e) => e.type === 'expense' && e.date?.startsWith(selectedMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  // ✅ Color Logic
  const budgetPercentage = monthlyBudget > 0 ? (monthlyExpenses / monthlyBudget) * 100 : 0;
  let budgetColor = '#C8E6C9'; // soft green
  if (budgetPercentage >= 95) {
    budgetColor = '#E53935'; // red
  } else if (budgetPercentage >= 75) {
    budgetColor = '#FFB300'; // yellow
  }

  const formatTitle = (str: string) =>
    str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const expenseBreakdown: Record<string, number> = {};
  const incomeBreakdown: Record<string, number> = {};
  const categorizedExpenses: Record<string, Entry[]> = {};

  entries.forEach((entry) => {
    if (entry.type === 'expense') {
      expenseBreakdown[entry.category] = (expenseBreakdown[entry.category] || 0) + entry.amount;
      categorizedExpenses[entry.category] = categorizedExpenses[entry.category] || [];
      categorizedExpenses[entry.category].push(entry);
    } else if (entry.type === 'income') {
      const source = formatTitle(entry.note || 'Uncategorized');
      incomeBreakdown[source] = (incomeBreakdown[source] || 0) + entry.amount;
    }
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleDeleteEntry = async (entryToDelete: Entry) => {
    const updated = entries.filter((e) => {
      return !(
        e.date === entryToDelete.date &&
        e.amount === entryToDelete.amount &&
        e.category === entryToDelete.category &&
        e.note === entryToDelete.note &&
        e.type === entryToDelete.type
      );
    });
  
    setEntries(updated);
  
    const calendarMap: { [date: string]: Entry[] } = {};
    updated.forEach((e) => {
      calendarMap[e.date!] = [...(calendarMap[e.date!] || []), e];
    });
  
    const calendarData = stripTypenameDeep(
      Object.entries(calendarMap).map(([date, entries]) => ({
        date,
        entries: entries.map(({ date, ...entry }) => entry),
      }))
    );
    await saveCalendarData(calendarData);
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
        {stressLevel && (
          <p className="text-[#1D7E5F] font-semibold text-xl">🧠 Stress Level: {stressLevel}</p>
        )}

        <div className="mt-4 border-t pt-4 border-[#29AB87]">
          <p className="text-[#1D7E5F] font-semibold">📊 Monthly Income: ${monthlyIncome.toFixed(2)}</p>
          <p
            className="font-semibold"
            style={{
              color: '#1D7E5F',
              backgroundColor: monthlyBudget === 0 ? 'transparent' : budgetColor,
              padding: '0.5rem',
              borderRadius: '0.5rem',
            }}
          >
            📉 Monthly Expenses: ${monthlyExpenses.toFixed(2)}
            {monthlyBudget > 0 && ` (of $${monthlyBudget.toFixed(2)})`}
          </p>
        </div>

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
                          <li key={idx} className="flex justify-between items-center">
                            <span>
                              ${entry.amount.toFixed(2)} {entry.note && `- ${entry.note}`}
                            </span>
                            <button
                              onClick={() => handleDeleteEntry(entry)}
                              className="text-red-600 hover:text-red-800 text-sm ml-2"
                              title="Delete entry"
                            >
                              🗑️
                            </button>
                          </li>
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
                {entries
                  .filter((e) => e.type === 'income')
                  .map((entry, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span>
                        ${entry.amount.toFixed(2)} {entry.note && `- ${entry.note}`}
                      </span>
                      <button
                        onClick={() => handleDeleteEntry(entry)}
                        className="text-red-600 hover:text-red-800 text-sm ml-2"
                        title="Delete income entry"
                      >
                        🗑️
                      </button>
                    </li>
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
