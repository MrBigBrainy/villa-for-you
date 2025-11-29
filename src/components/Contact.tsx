"use client";

import { useState, useRef, useEffect } from "react";
import { residences } from "@/data/residences";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronDown, Check } from "lucide-react";
import DatePicker from "./ui/DatePicker";
import TimePicker from "./ui/TimePicker";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Contact() {
  const { settings } = useSiteSettings();
  const [selectedResidence, setSelectedResidence] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
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

  // Find the selected residence name for display
  const selectedResidenceName = residences.find(r => r.id === selectedResidence)?.name || "Select Residence";

  // Format date for display
  const formattedDate = selectedDate 
    ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "";

  return (
    <section id="contact" className="py-20 md:py-32 bg-zinc-900 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-8">
              Begin Your Journey
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed mb-12 text-lg">
              Ready to experience the extraordinary? Contact us to schedule a viewing or request more information about Villa Pik.
            </p>
            
            <div className="space-y-8">
              <div className="group">
                <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-white transition-colors">Address</h4>
                <p className="text-xl font-serif">{settings.address}</p>
              </div>
              <div className="group">
                <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-white transition-colors">Phone</h4>
                <p className="text-xl font-serif">{settings.phone}</p>
              </div>
              <div className="group">
                <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-white transition-colors">Email</h4>
                <p className="text-xl font-serif">{settings.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors"
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white pointer-events-none"
                  >
                    Your Name
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white pointer-events-none"
                  >
                    Your Email
                  </label>
                </div>
              </div>
              
              {/* Custom Select for Residence */}
              <div className="relative">
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Interested Residence</label>
                <div 
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className={`w-full bg-transparent border-b border-zinc-700 py-4 flex items-center justify-between cursor-pointer group hover:border-zinc-500 transition-colors ${isSelectOpen ? 'border-white' : ''}`}
                >
                  <span className={selectedResidence ? "text-white" : "text-zinc-500"}>
                    {selectedResidenceName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isSelectOpen ? "rotate-180 text-white" : "group-hover:text-white"}`} />
                </div>
                
                <AnimatePresence>
                  {isSelectOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-20 top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {residences.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => {
                            setSelectedResidence(res.id);
                            setIsSelectOpen(false);
                          }}
                          className="px-4 py-3 cursor-pointer hover:bg-zinc-700 transition-colors flex items-center justify-between group"
                        >
                          <span className="text-zinc-300 group-hover:text-white transition-colors">{res.name}</span>
                          {selectedResidence === res.id && <Check className="w-4 h-4 text-white" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Custom Date Picker */}
                <div className="relative" ref={dateRef}>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Preferred Date</label>
                  <div 
                    onClick={() => setIsDateOpen(!isDateOpen)}
                    className={`relative flex items-center justify-between border-b border-zinc-700 py-3 cursor-pointer group hover:border-zinc-500 transition-colors ${isDateOpen ? 'border-white' : ''}`}
                  >
                    <span className={selectedDate ? "text-white" : "text-zinc-500"}>
                      {formattedDate || "Select Date"}
                    </span>
                    <Calendar className={`w-4 h-4 text-zinc-500 transition-colors ${isDateOpen ? "text-white" : "group-hover:text-white"}`} />
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
                    className={`relative flex items-center justify-between border-b border-zinc-700 py-3 cursor-pointer group hover:border-zinc-500 transition-colors ${isTimeOpen ? 'border-white' : ''}`}
                  >
                    <span className={selectedTime ? "text-white" : "text-zinc-500"}>
                      {selectedTime || "Select Time"}
                    </span>
                    <Clock className={`w-4 h-4 text-zinc-500 transition-colors ${isTimeOpen ? "text-white" : "group-hover:text-white"}`} />
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
              </div>

              <div className="relative group">
                <textarea
                  id="message"
                  rows={4}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors resize-none"
                ></textarea>
                <label 
                  htmlFor="message" 
                  className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white pointer-events-none"
                >
                  Your Message
                </label>
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full md:w-auto px-12 py-4 bg-white text-zinc-900 text-sm font-bold tracking-widest uppercase hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 mt-8"
              >
                Reservation
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
