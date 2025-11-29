"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Residence } from "@/data/residences";

export default function Hero({ residences = [] }: { residences?: Residence[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter out sold residences for the hero section if needed, or just show all
  // For hero, usually we want to show the best ones. Let's use the passed residences.
  const heroResidences = residences.length > 0 ? residences : [];

  useEffect(() => {
    if (!isAutoPlaying || heroResidences.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroResidences.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroResidences.length]);

  if (heroResidences.length === 0) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
        <div className="text-white/50">Loading residences...</div>
      </section>
    );
  }

  const activeResidence = heroResidences[currentIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-900">
      {/* Main Background Image */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeResidence.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${activeResidence.image}')` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-20 pb-8">
        
        {/* Left: Text Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeResidence.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-zinc-300 mb-4">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-white/10">
                  Featured
                </span>
                <span className="flex items-center text-sm tracking-wide uppercase">
                  <MapPin className="w-4 h-4 mr-1" />
                  {activeResidence.location}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight text-white">
                {activeResidence.name}
              </h1>
              
              <p className="text-lg font-light tracking-wide max-w-xl mb-10 text-zinc-200 line-clamp-3">
                {activeResidence.description}
              </p>
              
              <div className="flex items-center gap-6">
                <Link
                  href={`/residences/${activeResidence.id}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 text-sm font-bold tracking-widest uppercase hover:bg-zinc-100 transition-colors rounded-full"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
               
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right/Bottom: Thumbnails Strip */}
        <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-end pb-8">
          <div className="w-full overflow-x-auto no-scrollbar pb-4">
            <div className="flex gap-4 px-4 min-w-max">
              {heroResidences.map((residence, index) => (
                <motion.div
                  key={residence.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`relative w-40 h-64 md:w-56 md:h-80 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 group ${
                    index === currentIndex 
                      ? "ring-2 ring-white scale-100 opacity-100" 
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  whileHover={{ y: -10 }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${residence.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1 truncate">
                      {residence.location}
                    </p>
                    <h3 className="text-white font-serif text-lg leading-tight truncate">
                      {residence.name}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {residence.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

