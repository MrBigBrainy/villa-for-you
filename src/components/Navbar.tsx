"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = ["Home", "Residences", "Features"];

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    // If we're already on the home page, just scroll
    if (pathname === "/") {
      const element = document.getElementById(sectionId.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page, then scroll after a delay to allow content to load
      router.push("/");
      
      // Wait for navigation and content to load before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId.toLowerCase());
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 800); // Increased delay to allow images to start loading
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className={`text-2xl font-serif z-50 relative ${scrolled || isMenuOpen ? "text-zinc-900" : "text-white"}`}>
            {settings.webName}
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={(e) => handleNavClick(e, item)}
                className={`cursor-pointer text-sm font-medium tracking-wide hover:opacity-70 transition-opacity ${
                  scrolled ? "text-zinc-900" : "text-white"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              onClick={(e) => handleNavClick(e, "contact")}
              className={`cursor-pointer px-6 py-2 text-sm font-medium tracking-wide border transition-colors ${
                scrolled
                  ? "border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-zinc-900"
              }`}
            >
              Reservation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden z-50 relative p-2 -mr-2 ${scrolled || isMenuOpen ? "text-zinc-900" : "text-white"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col items-center space-y-8"
          >
            {navItems.map((item) => (
              <button
                key={item}
                onClick={(e) => handleNavClick(e, item)}
                className="text-2xl font-serif text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={(e) => handleNavClick(e, "contact")}
              className="px-8 py-3 text-lg font-medium tracking-wide border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors w-full max-w-xs rounded-lg"
            >
              Reservation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
