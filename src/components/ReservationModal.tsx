"use client";

import { useState, useRef, useEffect } from "react";
import { X, Calendar, Clock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "./ui/DatePicker";
import TimePicker from "./ui/TimePicker";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  residenceName: string;
}

export default function ReservationModal({ isOpen, onClose, residenceName }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Date Picker State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);

  // Time Picker State
  const [selectedTime, setSelectedTime] = useState("");
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setIsTimeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate reservation submission
    toast.success("Schedule viewing request submitted! We'll contact you soon.", {
      duration: 4000,
      icon: "✨",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setSelectedDate(null);
    setSelectedTime("");
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Format date for display
  const formattedDate = selectedDate 
    ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-zinc-700/50"
        >
          {/* Header with gradient */}
          <div className="sticky top-0 bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-700/50 p-8 z-10 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Exclusive Viewing</span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-serif text-white mb-2"
                >
                  Schedule a Viewing
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-zinc-400"
                >
                  {residenceName}
                </motion.p>
              </div>
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/10 transition-all rounded-full border border-zinc-700 hover:border-zinc-500"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit} 
            className="p-8 space-y-8"
          >
            {/* Name & Email */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-transparent focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
                <label className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white pointer-events-none">
                  Your Name
                </label>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-transparent focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
                <label className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white pointer-events-none">
                  Your Email
                </label>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-transparent focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
                <label className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white pointer-events-none">
                  Phone Number
                </label>
              </motion.div>
            </div>

            {/* Date & Time */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-8"
            >
              {/* Custom Date Picker */}
              <div className="relative" ref={dateRef}>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Preferred Date</label>
                <div 
                  onClick={() => setIsDateOpen(!isDateOpen)}
                  className={`relative flex items-center justify-between border-b border-zinc-700 py-3 cursor-pointer group hover:border-zinc-500 transition-colors ${isDateOpen ? 'border-amber-400' : ''}`}
                >
                  <span className={selectedDate ? "text-white" : "text-zinc-500"}>
                    {formattedDate || "Select Date"}
                  </span>
                  <Calendar className={`w-4 h-4 text-zinc-500 transition-colors ${isDateOpen ? "text-amber-400" : "group-hover:text-white"}`} />
                </div>
                <AnimatePresence>
                  {isDateOpen && (
                    <DatePicker 
                      selectedDate={selectedDate} 
                      onSelect={setSelectedDate} 
                      onClose={() => setIsDateOpen(false)} 
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Custom Time Picker */}
              <div className="relative" ref={timeRef}>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Preferred Time</label>
                <div 
                  onClick={() => setIsTimeOpen(!isTimeOpen)}
                  className={`relative flex items-center justify-between border-b border-zinc-700 py-3 cursor-pointer group hover:border-zinc-500 transition-colors ${isTimeOpen ? 'border-amber-400' : ''}`}
                >
                  <span className={selectedTime ? "text-white" : "text-zinc-500"}>
                    {selectedTime || "Select Time"}
                  </span>
                  <Clock className={`w-4 h-4 text-zinc-500 transition-colors ${isTimeOpen ? "text-amber-400" : "group-hover:text-white"}`} />
                </div>
                <AnimatePresence>
                  {isTimeOpen && (
                    <TimePicker 
                      selectedTime={selectedTime} 
                      onSelect={setSelectedTime} 
                      onClose={() => setIsTimeOpen(false)} 
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative group"
            >
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-transparent focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
              <label className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white pointer-events-none">
                Special Requests (Optional)
              </label>
            </motion.div>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-900 py-4 font-bold tracking-widest uppercase transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 rounded-lg"
              >
                Schedule Viewing
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 border border-zinc-700 text-white py-4 font-bold tracking-widest uppercase hover:bg-white/5 transition-all rounded-lg"
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
