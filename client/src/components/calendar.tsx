import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { CalendarOptions } from '@fullcalendar/core';
import Input from './Input';

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // TypeScript-safe calendar config (except dateClick)
  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    initialDate: new Date(),
    headerToolbar: false,
    height: 'auto',
    events: [
      { title: '💸 Grocery - $23', date: '2025-04-05' },
      { title: '💰 Paycheck - $300', date: '2025-04-01' },
    ],
  };

  const handleChangeView = (view: string) => {
    calendarRef.current?.getApi().changeView(view);
  };

  const handleGoToToday = () => {
    calendarRef.current?.getApi().today();
  };

  return (
    <div className="bg-white/90 p-6 rounded-2xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1D7E5F] text-center mb-6">
        📆 Real Money Magic Calendar
      </h2>

      {/* View toggle buttons */}
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

      {/* 📅 Calendar view */}
      <FullCalendar
        {...calendarOptions}
        dateClick={(info) => setSelectedDate(info.dateStr)}
        ref={calendarRef}
      />

      {/* 🧾 Input form for selected date */}
      {selectedDate && (
        <div className="mt-6">
          <Input date={selectedDate} />
        </div>
      )}
    </div>
  );
};

export default Calendar;
