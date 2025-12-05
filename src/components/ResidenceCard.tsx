"use client";

import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize, MapPin, ArrowUpRight } from "lucide-react";
import { Residence } from "@/data/residences";
import { motion } from "framer-motion";

export default function ResidenceCard({ residence }: { residence: Residence }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link href={`/residences/${residence.id}`} className="group block relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl">
        {/* Image Background */}
        <div className="absolute inset-0">
          <Image
            src={residence.image}
            alt={residence.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex justify-between items-start z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white text-[10px] md:text-xs font-medium tracking-widest uppercase">
            {residence.location}
          </div>
          <div className="bg-white text-zinc-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold tracking-wide shadow-lg">
            {residence.price}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10 transform translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex justify-between items-end mb-3 md:mb-4">
            <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight">
              {residence.name}
            </h3>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 border-t border-white/20 pt-4 md:pt-6 text-white/90">
            <div className="flex flex-col gap-0.5 md:gap-1">
              <div className="flex items-center gap-1.5 md:gap-2 text-white/60 text-[10px] md:text-xs uppercase tracking-wider">
                <Bed className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Bedrooms</span>
              </div>
              <span className="text-base md:text-lg font-medium">{residence.features.beds}</span>
            </div>
            <div className="flex flex-col gap-0.5 md:gap-1">
              <div className="flex items-center gap-1.5 md:gap-2 text-white/60 text-[10px] md:text-xs uppercase tracking-wider">
                <Bath className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Bathrooms</span>
              </div>
              <span className="text-base md:text-lg font-medium">{residence.features.baths}</span>
            </div>
            <div className="flex flex-col gap-0.5 md:gap-1">
              <div className="flex items-center gap-1.5 md:gap-2 text-white/60 text-[10px] md:text-xs uppercase tracking-wider">
                <Maximize className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Area</span>
              </div>
              <span className="text-base md:text-lg font-medium">{residence.features.sqft} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
