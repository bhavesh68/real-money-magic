// Dashboard.tsx
import { useState } from 'react';
import dayjs from 'dayjs';
import QuoteCard from '../components/QuoteCard';
import Calendar from '../components/calendar';
import Input from '../components/Input';
import StressTracker from '../components/StressTracker';
import type { Entry } from '../types/entries';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [showStress, setShowStress] = useState(false);

  // ⭐️ NEW: track emoji per date
  const [stressEntries, setStressEntries] = useState<{ [date: string]: '😊' | '🥺' | '🤯' }>({});

  // ⭐️ NEW: update emoji for selected date
  const handleEmojiChange = (emoji: '😊' | '🥺' | '🤯') => {
    setStressEntries((prev) => ({
      ...prev,
      [selectedDate]: emoji,
    }));
  };

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
    <div className="min-h-screen bg-money-bg bg-cover bg-center relative flex flex-col items-center px-4 py-6">
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* ✨ Sparkle Overlay Layer */}
      <div className="sparkle-layer">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Inspirational Quote */}
        <QuoteCard />

        {/* ➕ Add Entry + 🧘 Mental Load buttons */}
        <div className="mt-6 flex flex-col items-center w-full max-w-3xl space-y-4 mb-4 md:space-y-0 md:flex-row md:justify-between">
          <button
            onClick={() => setShowInput((prev) => !prev)}
            className="bg-[#29AB87] text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#218F71] transition-all w-full md:w-1/2 md:mr-2"
          >
            {showInput ? 'Close Entry Form ✖' : '➕ Add Entry'}
          </button>

          <button
            onClick={() => setShowStress((prev) => !prev)}
            className="bg-[#29AB87] text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#218F71] transition-all w-full md:w-1/2 md:ml-2"
          >
            {showStress ? 'Close Stress Tracker ✖' : '🧘 Mental Load'}
          </button>
        </div>

        {/* Input Form */}
        {showInput && (
          <div className="w-full max-w-3xl mb-4">
            <Input onAddEntry={handleAddEntry} />
          </div>
        )}

        {/* 🌈 Stress Tracker Form */}
        {showStress && (
          <div className="w-full max-w-3xl mb-4">
            <StressTracker
              date={selectedDate}
              currentEmoji={stressEntries[selectedDate]} 
              onEmojiChange={handleEmojiChange} 
              onClose={() => setShowStress(false)}          
            />
          </div>
        )}

        {/* Calendar Component */}
        <Calendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          entries={entries}
          stressEntries={stressEntries} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
