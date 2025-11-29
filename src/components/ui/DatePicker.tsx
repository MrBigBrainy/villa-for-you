"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DatePickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export default function DatePicker({ selectedDate, onSelect, onClose }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Initialize current month to selected date if exists
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-30 top-full left-0 mt-2 p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-72"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-serif font-medium">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-zinc-500 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(date => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => {
                onSelect(date);
                onClose();
              }}
              className={`
                h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all
                ${isSelected 
                  ? "bg-white text-black font-bold shadow-lg scale-110" 
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }
                ${isCurrentDay && !isSelected ? "border border-zinc-600 text-white" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
