"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface TimePickerProps {
  selectedTime: string;
  onSelect: (time: string) => void;
  onClose: () => void;
}

export default function TimePicker({ selectedTime, onSelect, onClose }: TimePickerProps) {
  // Generate time slots from 09:00 to 18:00 every 30 mins
  const timeSlots = [];
  for (let i = 9; i <= 18; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    if (i !== 18) {
      timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-30 top-full left-0 mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar"
    >
      <div className="p-2 space-y-1">
        {timeSlots.map((time) => (
          <button
            type="button"
            key={time}
            onClick={() => {
              onSelect(time);
              onClose();
            }}
            className={`
              w-full px-4 py-2 rounded-lg text-sm flex items-center justify-between transition-colors
              ${selectedTime === time 
                ? "bg-zinc-900 text-white font-medium" 
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }
            `}
          >
            <span>{time}</span>
            {selectedTime === time && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
