import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { CalendarOptions } from '@fullcalendar/core';
import Input from './Input';

type Entry = {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  note?: string;
  recurring: boolean;
};

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dailyEntries, setDailyEntries] = useState<Record<string, Entry[]>>({});
  const [sparkleDate, setSparkleDate] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const handleSaveEntries = (date: string, entries: Entry[]) => {
    setDailyEntries((prev) => ({ ...prev, [date]: entries }));
    setSparkleDate(date); // ✨ trigger sparkle
    setTimeout(() => setSparkleDate(null), 1200);
  };

  const handleGoToToday = () => {
    calendarRef.current?.getApi().today();
    setSelectedDate(today);
  };

  const handleChangeView = (view: string) => {
    calendarRef.current?.getApi().changeView(view);
  };

  const eventList = Object.entries(dailyEntries).map(([date, entries]) => {
    const totalExpense = entries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = entries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      title: `💸 $${totalExpense.toFixed(2)} | 💰 $${totalIncome.toFixed(2)}`,
      date,
      className: sparkleDate === date ? 'twinkle' : '',
    };
  });

  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    initialDate: today,
    headerToolbar: false,
    height: 'auto',
    events: eventList,
  };

  return (
    <div className="bg-white/90 p-6 rounded-2xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1D7E5F] text-center mb-6">
        📆 Real Money Magic Calendar
      </h2>

      {/* 🧾 Input form above calendar */}
      {selectedDate && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-[#1D7E5F] w-full text-center">
              Add Entries for {selectedDate}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-red-600 hover:underline"
            >
              ✖ Close
            </button>
          </div>
          <Input date={selectedDate} onSaveEntries={handleSaveEntries} />
        </div>
      )}

      {/* 🌿 Controls */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        <button
          onClick={() => handleChangeView('dayGridMonth')}
          className="bg-[#29AB87] text-white py-2 px-4 rounded-xl hover:bg-[#218F71] transition"
        >
          🌞 Month
        </button>
        <button
          onClick={() => handleChangeView('timeGridWeek')}
          className="bg-[#29AB87] text-white py-2 px-4 rounded-xl hover:bg-[#218F71] transition"
        >
          🗓️ Week
        </button>
        <button
          onClick={() => handleChangeView('timeGridDay')}
          className="bg-[#29AB87] text-white py-2 px-4 rounded-xl hover:bg-[#218F71] transition"
        >
          📍 Day
        </button>
        <button
          onClick={handleGoToToday}
          className="bg-[#1D7E5F] text-white py-2 px-4 rounded-xl hover:bg-[#155D47] transition"
        >
          🔄 Today
        </button>
      </div>

      {/* 📅 Calendar */}
      <FullCalendar
        {...calendarOptions}
        dateClick={(info: any) => setSelectedDate(info.dateStr)}
        ref={calendarRef}
      />

      {/* ✨ Sparkle CSS */}
      <style>
        {`
          .twinkle {
            animation: sparkleFade 1s ease-out;
            background-color: #fef3c7 !important;
            font-weight: bold;
            color: #1D7E5F !important;
          }

          @keyframes sparkleFade {
            0% { background-color: #fffde7; transform: scale(1.1); }
            50% { background-color: #fef3c7; }
            100% { background-color: transparent; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Calendar;
