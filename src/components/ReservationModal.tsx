"use client";

import { useState, useRef, useEffect } from "react";
import { X, Calendar, Clock, ChevronDown, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "./ui/DatePicker";
import TimePicker from "./ui/TimePicker";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  residenceId: string;
}

interface ContactFormData {
  name: string;
  email: string;
  residenceId: string;
  date: Date | null;
  time: string;
  message: string;
}

export default function ReservationModal({ isOpen, onClose, residenceId }: ReservationModalProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [residences, setResidences] = useState<any[]>([]);
  
  const dateRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResidences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "residences"));
        const residencesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResidences(residencesData);
      } catch (error) {
        console.error("Error fetching residences:", error);
      }
    };
    fetchResidences();
  }, []);

  const { 
    register, 
    control, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      residenceId: residenceId,
      date: null,
      time: "",
      message: ""
    }
  });

  // Update default residenceId when prop changes
  useEffect(() => {
    if (isOpen) {
      setValue("residenceId", residenceId);
    }
  }, [isOpen, residenceId, setValue]);

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

  const onSubmit = async (data: ContactFormData) => {
    try {
      await axios.post('/api/send', data);
      toast.success('Reservation request sent successfully!');
      
      reset({
        name: "",
        email: "",
        residenceId: residenceId,
        date: null,
        time: "",
        message: ""
      });
      
      setIsSelectOpen(false);
      setIsDateOpen(false);
      setIsTimeOpen(false);
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send reservation request. Please try again.');
    }
  };

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
          className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-zinc-100 px-8 pt-8 pb-4 z-10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-serif text-zinc-900 mb-2">
                  Schedule a Viewing
                </h2>
                <p className="text-sm text-zinc-500">
                  Fill out the form below to request a private tour.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 transition-all rounded-full text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 pt-4 space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  id="modal-name"
                  placeholder=" "
                  className={`peer w-full bg-transparent border-b py-4 text-zinc-900 placeholder-transparent focus:outline-none focus:border-zinc-900 transition-colors ${errors.name ? 'border-red-500' : 'border-zinc-300'}`}
                  {...register("name", { required: "Name is required" })}
                />
                <label 
                  htmlFor="modal-name" 
                  className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-900 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-900 pointer-events-none"
                >
                  Your Name {errors.name && <span className="text-red-500">*</span>}
                </label>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  id="modal-email"
                  placeholder=" "
                  className={`peer w-full bg-transparent border-b py-4 text-zinc-900 placeholder-transparent focus:outline-none focus:border-zinc-900 transition-colors ${errors.email ? 'border-red-500' : 'border-zinc-300'}`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                <label 
                  htmlFor="modal-email" 
                  className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-900 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-900 pointer-events-none"
                >
                  Your Email {errors.email && <span className="text-red-500">*</span>}
                </label>
              </div>
            </div>
            
            {/* Custom Select for Residence */}
            <Controller
              control={control}
              name="residenceId"
              render={({ field }) => {
                const selectedResidenceName = residences.find(r => r.id === field.value)?.name || "Select Residence";
                return (
                  <div className="relative">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Interested Residence</label>
                    <div 
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className={`w-full bg-transparent border-b py-4 flex items-center justify-between cursor-pointer group hover:border-zinc-500 transition-colors ${isSelectOpen ? 'border-zinc-900' : 'border-zinc-300'}`}
                    >
                      <span className={field.value ? "text-zinc-900" : "text-zinc-500"}>
                        {selectedResidenceName}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isSelectOpen ? "rotate-180 text-zinc-900" : "group-hover:text-zinc-900"}`} />
                    </div>
                    
                    <AnimatePresence>
                      {isSelectOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {residences.map((res) => (
                            <div
                              key={res.id}
                              onClick={() => {
                                field.onChange(res.id);
                                setIsSelectOpen(false);
                              }}
                              className="px-4 py-3 cursor-pointer hover:bg-zinc-50 transition-colors flex items-center justify-between group"
                            >
                              <span className="text-zinc-600 group-hover:text-zinc-900 transition-colors">{res.name}</span>
                              {field.value === res.id && <Check className="w-4 h-4 text-zinc-900" />}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-8">
              {/* Custom Date Picker */}
              <Controller
                control={control}
                name="date"
                render={({ field }) => {
                  const formattedDate = field.value 
                    ? field.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : "";
                  return (
                    <div className="relative" ref={dateRef}>
                      <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Preferred Date</label>
                      <div 
                        onClick={() => setIsDateOpen(!isDateOpen)}
                        className={`relative flex items-center justify-between border-b py-3 cursor-pointer group hover:border-zinc-500 transition-colors ${isDateOpen ? 'border-zinc-900' : 'border-zinc-300'}`}
                      >
                        <span className={field.value ? "text-zinc-900" : "text-zinc-500"}>
                          {formattedDate || "Select Date"}
                        </span>
                        <Calendar className={`w-4 h-4 text-zinc-500 transition-colors ${isDateOpen ? "text-zinc-900" : "group-hover:text-zinc-900"}`} />
                      </div>
                      <AnimatePresence>
                        {isDateOpen && (
                          <div className="absolute z-30 top-full left-0 mt-2">
                             <DatePicker 
                              selectedDate={field.value} 
                              onSelect={(date) => {
                                field.onChange(date);
                                setIsDateOpen(false);
                              }} 
                              onClose={() => setIsDateOpen(false)} 
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }}
              />

              {/* Custom Time Picker */}
              <Controller
                control={control}
                name="time"
                render={({ field }) => (
                  <div className="relative" ref={timeRef}>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Preferred Time</label>
                    <div 
                      onClick={() => setIsTimeOpen(!isTimeOpen)}
                      className={`relative flex items-center justify-between border-b py-3 cursor-pointer group hover:border-zinc-500 transition-colors ${isTimeOpen ? 'border-zinc-900' : 'border-zinc-300'}`}
                    >
                      <span className={field.value ? "text-zinc-900" : "text-zinc-500"}>
                        {field.value || "Select Time"}
                      </span>
                      <Clock className={`w-4 h-4 text-zinc-500 transition-colors ${isTimeOpen ? "text-zinc-900" : "group-hover:text-zinc-900"}`} />
                    </div>
                    <AnimatePresence>
                      {isTimeOpen && (
                        <div className="absolute z-30 top-full left-0 mt-2">
                          <TimePicker 
                            selectedTime={field.value} 
                            onSelect={(time) => {
                              field.onChange(time);
                              setIsTimeOpen(false);
                            }} 
                            onClose={() => setIsTimeOpen(false)} 
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              />
            </div>

            <div className="relative group">
              <textarea
                id="modal-message"
                rows={4}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-zinc-300 py-4 text-zinc-900 placeholder-transparent focus:outline-none focus:border-zinc-900 transition-colors resize-none"
                {...register("message")}
              ></textarea>
              <label 
                htmlFor="modal-message" 
                className="absolute left-0 top-4 text-zinc-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-900 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-900 pointer-events-none"
              >
                Your Message
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-zinc-900 text-white py-4 font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Schedule Viewing"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-zinc-300 text-zinc-900 py-4 font-bold tracking-widest uppercase hover:bg-zinc-50 transition-all rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
