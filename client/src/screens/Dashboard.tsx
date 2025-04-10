// Dashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import QuoteCard from '../components/QuoteCard';
import Calendar from '../components/calendar';
import Input from '../components/Input';
import StressTracker from '../components/StressTracker';
import SetBudget from '../components/setBudget';
import { Budget } from '../types/budget';
import type { Entry, CalendarEntry, Emoji } from '../types/entries';
import { useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { stripTypenameDeep } from '../utils/stripTypename';
import '../css/sparkles.css';

const Dashboard = () => {
  const { id } = useParams();
  const {
    project,
    loading,
    error,
    saveBudgetData,
    saveCalendarData,
    saveStressData,
  } = useProject(id!);

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showInput, setShowInput] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showStress, setShowStress] = useState(false);

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const stored = localStorage.getItem('monthlyBudget');
    return stored ? parseFloat(stored) : 0;
  });

  // ─── Local States Based on Project Data ──────────────────────────────
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stressEntries, setStressEntries] = useState<{ [date: string]: Emoji }>({});

  // ─── Populate on Project Load ──────────────────────────────
  useEffect(() => {
    if (project) {
      setEntries(
        project.calendarData?.flatMap((entry: CalendarEntry): Entry[] =>
          entry.entries.map((e: Entry) => ({ ...e, date: entry.date }))
        ) || []
      );
      if (project.stressData) {
        const mapped = project.stressData.reduce(
          (acc: { [date: string]: Emoji }, item: { date: string; emoji: Emoji }) => {
            acc[item.date] = item.emoji;
            return acc;
          },
          {}
        );
        setStressEntries(mapped);
      }
    }
  }, [project]);

  // ─── Add Entry to Calendar + Save ──────────────────────────────
  const handleAddEntry = async (entry: Entry): Promise<void> => {
    const newEntry = { ...entry, date: selectedDate };
    const updated: Entry[] = [...entries, newEntry];
  
    if (entry.recurring) {
      for (let i = 1; i < 12; i++) {
        const futureDate = dayjs(selectedDate).add(i, 'month').format('YYYY-MM-DD');
        updated.push({ ...entry, date: futureDate });
      }
    }
  
    setEntries(updated);
  
    const calendarMap: { [date: string]: Entry[] } = {};
      updated.forEach((e: Entry) => {
        calendarMap[e.date!] = [...(calendarMap[e.date!] || []), e];
      });

      const calendarData: CalendarEntry[] = Object.entries(calendarMap).map(([date, entries]) => ({
        date,
        entries: entries.map(({ date, ...rest }) => rest),
      }));

      await saveCalendarData(stripTypenameDeep(calendarData));
  };

/*   const handleBudgetSave = async (data: Budget) => {
    const entries = Object.entries(data)
      .filter(([key]) => key !== 'otherNote')
      .map(([category, amount]) => ({
        category,
        amount,
        type: 'expense',
        recurring: false,
        note: category === 'otherAmount' ? data.otherNote : ''
      }));
  
    await saveBudgetData(stripTypenameDeep(entries)); 
  }; 
  */ 
  
  const handleEmojiChange = async (emoji: '😊' | '🥺' | '🤯') => {
    setStressEntries((prev) => {
      const current = prev[selectedDate];
      const updated = { ...prev };
  
      if (current === emoji) {
        delete updated[selectedDate];
      } else {
        updated[selectedDate] = emoji;
      }
  
      // 🔄 Persist to backend immediately
      saveStressData(updated);
  
      return updated;
    });
  };
  

  if (loading) return <p>Loading your project workspace...</p>;
  if (error) {
    console.log("📛 Dashboard load failure", { id, error });
    return <p>Error loading project 😢</p>;
  }

  const handleSaveProject = async () => {
    if (!id) {
      console.warn("❌ No project ID found in URL.");
      return;
    }
  
    try {
      // Save Calendar
      const calendarMap: { [date: string]: Entry[] } = {};
      entries.forEach((e: Entry) => {
        calendarMap[e.date!] = [...(calendarMap[e.date!] || []), e];
      });
  
      const calendarData: CalendarEntry[] = Object.entries(calendarMap).map(([date, entries]) => ({
        date,
        entries: entries.map(({ date, ...entry }) => entry),
      }));
  
      await saveCalendarData(stripTypenameDeep(calendarData));
      await saveStressData(stressEntries);
      console.log("✅ Calendar & Stress data saved");
  
      // 💰 Save Budget is already called through SetBudget, but we could centralize if needed
  
      alert("✅ Project saved successfully!");
      navigate("/profile");

    } catch (err) {
      console.error("❌ Error saving project:", err);
      alert("Failed to save project.");
    }
  };  

  return (
    <div className="min-h-screen bg-money-bg bg-cover bg-center relative flex flex-col items-center px-4 py-6">
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* ✨ Sparkle Overlay Layer */}
      <div className="sparkle-layer">
        {[...Array(25)].map((_, i) => (
          <div key={i} className={`sparkle sparkle-${i + 1}`} />
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
            onClick={() => setShowBudget((prev) => !prev)}
            className="bg-[#29AB87] text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#218F71] transition-all w-full md:w-1/3 md:ml-2"
          >
            {showBudget ? 'Close Budget ✖' : '🧾 Set Budget'}
          </button>

          <button
            onClick={() => setShowStress((prev) => !prev)}
            className="bg-[#29AB87] text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#218F71] transition-all w-full md:w-1/2 md:ml-2"
          >
            {showStress ? 'Close Stress Tracker ✖' : '🧘 Mental Load'}
          </button>
        </div>

        {/* Input Form */}
        {showInput && project && id && (
          <div className="w-full max-w-3xl mb-4">
            <Input onAddEntry={handleAddEntry} />
          </div>
        )}

        {/* 🌈 Stress Tracker Form */}
        {showStress && project && id && (
          <div className="w-full max-w-3xl mb-4">
            <StressTracker
              date={selectedDate}
              currentEmoji={stressEntries[selectedDate as string]} 
              onEmojiChange={handleEmojiChange}
              onClose={() => setShowStress(false)}
            />
          </div>
        )}

      {showBudget && project && id && (
        <div className="w-full max-w-3xl mb-4">
          <SetBudget
            projectId={id}
            onSave={({ total }) => setMonthlyBudget(total)}
            />
          </div>
        )}

        {/* Calendar Component */}
        <Calendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          entries={entries}
          stressEntries={stressEntries} 
          setEntries={setEntries} 
          saveCalendarData={saveCalendarData}
          budgetData={project.budgetData}
          monthlyBudget={monthlyBudget}
        />
      </div>

      {/* 💾 Save Project Floating Button */}
      <button
        onClick={handleSaveProject}
         className="fixed bottom-6 right-6 bg-[#29AB87] hover:bg-[#218F71] text-white font-bold py-3 px-6 rounded-full shadow-lg z-20"
          >
        💾 Save Project & Exit
      </button>
    </div>
  );
};

export default Dashboard;