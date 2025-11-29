"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const images = [
    "/1.jpg",
    "/2.jpg",
    "/5.jpg",
    "/7.jpg",
    "/8.jpg",
    "/9.jpg",
  ];

  // More organic positions with increased vertical spread
  // Using 'vw' and 'vh' for better responsiveness
  const positions = [
    { top: "10%", left: "10%", rotate: -8 },
    { top: "25%", left: "45%", rotate: 5 },
    { top: "15%", left: "80%", rotate: -5 },
    { top: "60%", left: "15%", rotate: 8 },
    { top: "75%", left: "55%", rotate: -3 },
    { top: "65%", left: "85%", rotate: 6 },
  ];

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-zinc-50">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
          className="absolute top-20 z-10 text-center pointer-events-none"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">
            Visual Journey
          </h2>
          <p className="text-zinc-500 font-light tracking-wide uppercase">
            Scroll to explore
          </p>
        </motion.div>

        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((src, index) => {
            const pos = positions[index];
            
            // Randomize initial stack slightly
            const initialRotate = (index % 2 === 0 ? 1 : -1) * (Math.random() * 5);
            
            const targetTop = pos.top;
            const targetLeft = pos.left;
            
            // We'll use a custom transform for each image
            const top = useTransform(scrollYProgress, [0, 1], ["50%", targetTop]);
            const left = useTransform(scrollYProgress, [0, 1], ["50%", targetLeft]);
            const rotate = useTransform(scrollYProgress, [0, 1], [initialRotate, pos.rotate]);
            const scale = useTransform(scrollYProgress, [0, 1], [1, 1]);
            
            const zIndex = images.length - index;

            return (
              <motion.div
                key={index}
                style={{ 
                  top, 
                  left, 
                  rotate,
                  scale,
                  zIndex,
                  x: "-50%",
                  y: "-50%" 
                }}
                className="absolute w-[60vw] h-[40vw] md:w-[25vw] md:h-[18vw] shadow-2xl rounded-lg overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
