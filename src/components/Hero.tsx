"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/6.jpg",
    title: "Exquisite Residences",
    subtitle: "A Collection of",
    description: "Discover our curated portfolio of luxury villas, each offering a unique sanctuary of comfort and style."
  },
  {
    id: 2,
    image: "/3.jpg",
    title: "Oceanfront Paradise",
    subtitle: "Experience the",
    description: "Wake up to the sound of waves and breathtaking views of the endless horizon."
  },
  {
    id: 3,
    image: "/4.jpg",
    title: "Modern Elegance",
    subtitle: "Redefining",
    description: "Architectural masterpieces that blend seamlessly with the natural landscape."
  },
  {
    id: 4,
    image: "/10.jpg",
    title: "Private Sanctuary",
    subtitle: "Your Own",
    description: "Secluded retreats designed for ultimate privacy and relaxation."
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Get the next 3 slides for thumbnails
  const getThumbnails = () => {
    const thumbnails = [];
    for (let i = 1; i <= 3; i++) {
      thumbnails.push(slides[(currentIndex + i) % slides.length]);
    }
    return thumbnails;
  };

  const activeSlide = slides[currentIndex];
  const thumbnails = getThumbnails();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-900">
      {/* Main Background Image */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeSlide.id}
          layoutId={`bg-${activeSlide.id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${activeSlide.image}')` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Text Content */}
        <div className="lg:col-span-8 text-white pt-20 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-lg md:text-xl font-light tracking-widest uppercase mb-4 text-zinc-300">
                {activeSlide.subtitle}
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-tight">
                {activeSlide.title}
              </h1>
              <p className="text-lg font-light tracking-wide max-w-xl mb-10 text-zinc-200">
                {activeSlide.description}
              </p>
              <Link
                href="#residences"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 text-sm font-bold tracking-widest uppercase hover:bg-zinc-100 transition-colors rounded-full"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails Strip */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 items-end justify-center h-full pr-8">
          {thumbnails.map((slide, index) => (
            <motion.div
              key={slide.id}
              layoutId={`bg-${slide.id}`}
              onClick={() => handleThumbnailClick(slides.indexOf(slide))}
              className="relative w-48 h-64 rounded-xl overflow-hidden cursor-pointer shadow-2xl group border-2 border-white/20 hover:border-white/60 transition-colors"
              whileHover={{ scale: 1.05, x: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-serif font-medium truncate">
                  {slide.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 lg:hidden z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
