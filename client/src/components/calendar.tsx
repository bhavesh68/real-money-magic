// calendar.tsx
import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayjs from 'dayjs';
import TodaySummary from './TodaySummary';
import type { Entry, CalendarEntry } from '../types/entries';

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  entries: Entry[];
  stressEntries: { [date: string]: '😊' | '🥺' | '🤯' };
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>; 
  saveCalendarData: (data: CalendarEntry[]) => Promise<void>; 
  budgetData?: {
    category: string;
    amount: number;
    note?: string;
  }[];
   monthlyBudget: number; 
}

const Calendar = ({ 
  selectedDate,
  onDateChange,
  entries,
  stressEntries,
  setEntries,
  saveCalendarData,
  budgetData, 
  monthlyBudget}: CalendarProps) => {

  const fullCalendarRef = useRef<FullCalendar | null>(null);
  const [currentView, setCurrentView] = React.useState<'dayGridDay' | 'dayGridWeek' | 'dayGridMonth'>('dayGridDay');

  useEffect(() => {
    fullCalendarRef.current?.getApi().changeView(currentView);
  }, [currentView]);

  const entriesForSelectedDay = entries.filter((e) => e.date === selectedDate);
  const totalExpenses = entriesForSelectedDay
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = entriesForSelectedDay
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const emojiForDay = stressEntries[selectedDate];

  return (
    <div className="bg-white border-2 border-[#29AB87] rounded-2xl p-6 shadow-xl w-full max-w-3xl">
      {/* View buttons */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setCurrentView('dayGridMonth')}
          className={`px-4 py-1 rounded-lg border shadow ${
            currentView === 'dayGridMonth' ? 'bg-[#29AB87] text-white' : 'bg-white text-[#1D7E5F] border-[#29AB87]'
          }`}
        >
          📅 Month
        </button>
        <button
          onClick={() => setCurrentView('dayGridWeek')}
          className={`px-4 py-1 rounded-lg border shadow ${
            currentView === 'dayGridWeek' ? 'bg-[#29AB87] text-white' : 'bg-white text-[#1D7E5F] border-[#29AB87]'
          }`}
        >
          🗓️ Week
        </button>
        <button
          onClick={() => {
            fullCalendarRef.current?.getApi().today();
            onDateChange(dayjs().format('YYYY-MM-DD'));
            setCurrentView('dayGridDay');
          }}
          className="bg-[#29AB87] text-white px-4 py-1 rounded-lg shadow hover:bg-[#218F71]"
        >
          📍 Today
        </button>
      </div>

      {/* Calendar view and summary */}
      {currentView === 'dayGridDay' ? (
        <>
          <h2 className="text-2xl font-bold text-center text-[#1D7E5F] mb-4">
            {dayjs(selectedDate).format('MMMM D')}{" "}
            <span>{emojiForDay || ''}</span>
          </h2>

          <TodaySummary
            date={selectedDate}
            entries={entries}
            totalExpenses={totalExpenses}
            totalIncome={totalIncome}
            stressLevel={stressEntries[selectedDate]}
            setEntries={setEntries}
            saveCalendarData={saveCalendarData}
            budgetData={budgetData}
            monthlyBudget={monthlyBudget}
          />
        </>
      ) : (
        <FullCalendar
          ref={fullCalendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView={currentView}
          initialDate={selectedDate}
          headerToolbar={false}
          height="auto"
          dateClick={(info: DateClickArg) => {
            onDateChange(info.dateStr);
            setCurrentView('dayGridDay');
          }}
          events={[
            // Income totals per day
            ...Object.entries(
              entries
                .filter((e): e is Entry & { date: string } => !!e.date && e.type === 'income')
                .reduce((acc, e) => {
                  acc[e.date] = (acc[e.date] || 0) + e.amount;
                  return acc;
                }, {} as Record<string, number>)
            ).map(([date, total]) => ({
              title: `+ $${total.toFixed(2)}`,
              date,
              color: '#56C4A0', // lighter jungle green
            })),
          
            // Expense totals per day
            ...Object.entries(
              entries
                .filter((e): e is Entry & { date: string } => !!e.date && e.type === 'expense')
                .reduce((acc, e) => {
                  acc[e.date] = (acc[e.date] || 0) + e.amount;
                  return acc;
                }, {} as Record<string, number>)
            ).map(([date, total]) => ({
              title: `- $${total.toFixed(2)}`,
              date,
              color: '#F6A5A5', // salmon pink
            })),
          
            // Stress emoji
            ...Object.entries(stressEntries).map(([date, emoji]) => ({
              title: emoji,
              date,
              color: '#FFF8DC', // gentle yellow
            })),
          ]}                   
        />
      )}
    </div>
  );
};

export default Calendar;
