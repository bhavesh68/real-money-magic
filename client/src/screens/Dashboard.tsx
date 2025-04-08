// Dashboard.tsx
import { useState } from 'react';
import dayjs from 'dayjs';
import QuoteCard from '../components/QuoteCard';
import Calendar from '../components/calendar';
import Input from '../components/Input';
import type { Entry } from '../types/entries';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showInput, setShowInput] = useState(false);

  const handleAddEntry = (entry: Entry) => {
    setEntries((prev) => {
      const newEntries = [...prev, { ...entry, date: selectedDate }];
      if (entry.recurring) {
        for (let i = 1; i < 12; i++) {
          const futureDate = dayjs(selectedDate).add(i, 'month').format('YYYY-MM-DD');
          newEntries.push({ ...entry, date: futureDate });
        }
      }
      return newEntries;
    });
  };

  return (
    <div
      className="min-h-screen bg-money-bg bg-cover bg-center relative flex flex-col items-center px-4 py-6"
    >
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Removed the external <h1> title here */}

        {/* Inspirational Quote */}
        <QuoteCard />

        {/* Add Entry Button */}
        <button
          onClick={() => setShowInput((prev) => !prev)}
          className="mt-6 mb-4 bg-[#29AB87] text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#218F71] transition-all"
        >
          {showInput ? 'Close Entry Form ✖' : '+ Add Entry'}
        </button>

        {/* Input Form */}
        {showInput && (
          <div className="w-full max-w-3xl">
            <Input onAddEntry={handleAddEntry} />
          </div>
        )}

        {/* Calendar Component */}
        <Calendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          entries={entries}
        />
      </div>
    </div>
  );
};

export default Dashboard;
