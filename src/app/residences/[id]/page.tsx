"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Check, Calendar, Star, Share2, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Residence {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  subImages?: string[];
  location: string;
  features: {
    beds: number;
    baths: number;
    sqft: number;
  };
  amenities?: string[];
  mapIframe?: string;
  sold?: boolean;
}

export default function ResidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [residence, setResidence] = useState<Residence | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!residence?.subImages) return;
    setCurrentLightboxIndex((prev) => (prev + 1) % residence.subImages!.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!residence?.subImages) return;
    setCurrentLightboxIndex((prev) => (prev - 1 + residence.subImages!.length) % residence.subImages!.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  useEffect(() => {
    const fetchResidence = async () => {
      try {
        const docRef = doc(db, "residences", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Residence;
          // Mock subImages if they don't exist
          if (!data.subImages || data.subImages.length === 0) {
            data.subImages = [
              data.image,
              data.image, // In a real app, these would be different images
              data.image,
              data.image,
            ];
          }
          setResidence({ ...data, id: docSnap.id });
          setActiveImage(data.image);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching residence:", error);
        toast.error("Failed to load residence details");
      } finally {
        setLoading(false);
      }
    };

    fetchResidence();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!residence) {
    notFound();
    return null;
  }



  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <Navbar />
      
      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        residenceId={residence.id}
      />
      
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 cursor-zoom-in"
          onClick={() => {
            const index = residence.subImages?.indexOf(activeImage || residence.image);
            openLightbox(index !== -1 && index !== undefined ? index : 0);
          }}
        >
          <Image
            src={activeImage || residence.image}
            alt={residence.name}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        
        <div className="absolute top-24 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link 
              href="/#residences" 
              className="inline-flex items-center text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 pb-24 md:px-16 md:pt-16 md:pb-32 text-white">
          <div className="container mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-4xl"
            >
              <motion.div variants={fadeIn} className="flex items-center gap-4 mb-4">
                <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                  Exclusive
                </span>
                <div className="flex items-center text-sm font-medium tracking-wide">
                  <MapPin className="w-4 h-4 mr-1" />
                  {residence.location}
                </div>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight">
                {residence.name}
              </motion.h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gallery Thumbs (Floating Horizontal) */}
      <div className="container mx-auto px-6 -mt-12 lg:-mt-16 relative z-10 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {residence.subImages?.map((img, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setActiveImage(img);
                  openLightbox(idx);
                }}
                className="relative flex-shrink-0 w-64 aspect-[4/3] rounded-xl overflow-hidden group snap-start cursor-zoom-in shadow-lg border-2 border-white"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Image
                  src={img}
                  alt={`View ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Maximize className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </motion.button>
            ))}
            
            {/* Spacer to show "half" effect if needed, or just padding */}
            <div className="w-4 flex-shrink-0" />
          </div>
        </motion.div>
      </div>

      {/* Property Stats Bar */}
      <div className="container mx-auto px-6 mb-16">
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-zinc-100 p-8">
          <div className="grid grid-cols-3 gap-4 md:gap-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Bed className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest">Bedrooms</span>
              </div>
              <span className="text-2xl md:text-3xl font-serif text-zinc-900">{residence.features.beds}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-x border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Bath className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest">Bathrooms</span>
              </div>
              <span className="text-2xl md:text-3xl font-serif text-zinc-900">{residence.features.baths}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Maximize className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest">Square Feet</span>
              </div>
              <span className="text-2xl md:text-3xl font-serif text-zinc-900">{residence.features.sqft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left Column: Details */}
            <div className="w-full lg:w-2/3 space-y-16">
              
              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif text-zinc-900 mb-6">About this Residence</h2>
                <p className="text-zinc-600 leading-relaxed text-lg font-light text-justify">
                  {residence.description}
                </p>
                <p className="mt-4 text-zinc-600 leading-relaxed text-lg font-light text-justify">
                  Experience the epitome of luxury living in this meticulously designed sanctuary. 
                  Every detail has been crafted to offer an unparalleled lifestyle of comfort and elegance.
                  From the moment you step inside, you are greeted by an atmosphere of sophistication and tranquility.
                </p>
              </motion.div>

              {/* Features Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-serif text-zinc-900 mb-8">Amenities & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {(residence.amenities && residence.amenities.length > 0 
                    ? residence.amenities 
                    : ["Private Pool", "Ocean View", "Smart Home", "Wine Cellar", "Home Theater", "24/7 Security", "Private Gym", "Chef's Kitchen", "Spa"]
                  ).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-zinc-900">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-zinc-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Map */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-serif text-zinc-900">Location</h3>
                  <p className="text-zinc-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {residence.location}
                  </p>
                </div>
                <div className="w-full h-[400px] bg-zinc-100 rounded-2xl overflow-hidden shadow-inner border border-zinc-200 relative group">
                  {residence.mapIframe ? (
                    <div 
                      className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                      dangerouslySetInnerHTML={{ __html: residence.mapIframe }}
                    />
                  ) : (
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31617.11765243396!2d98.39225041711832!3d7.880447866832225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x305031fd2d6380a3%3A0x8df88000bd82f66b!2z4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4Lig4Li54LmA4LiB4LmH4LiVIOC4reC4s-C5gOC4oOC4reC5gOC4oeC4t-C4reC4h-C4oOC4ueC5gOC4geC5h-C4lSDguKDguLnguYDguIHguYfguJUgODMwMDA!5e0!3m2!1sth!2sth!4v1764690186667!5m2!1sth!2sth" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="transition-all duration-700"
                    />
                  )}
                  <div className="absolute inset-0 pointer-events-none border-4 border-white/50 rounded-2xl" />
                </div>
              </motion.div>

            </div>

            {/* Right Column: Sticky Reservation */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-100"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm text-zinc-400 uppercase tracking-wider font-medium mb-1">Listing Price</p>
                      <div className="text-4xl font-serif text-zinc-900">{residence.price}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        <span className="font-semibold text-zinc-900">Interested in this property?</span>
                        <br />
                        Schedule a private tour with our agents to experience the villa in person.
                      </p>
                    </div>
                  </div>
                  
                  {residence.sold ? (
                    <div className="w-full py-4 bg-zinc-100 text-zinc-400 font-bold tracking-widest uppercase text-center rounded-xl cursor-not-allowed mb-4">
                      Sold Out
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-4 bg-zinc-900 text-white font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all hover:shadow-lg hover:-translate-y-1 rounded-xl mb-4 flex items-center justify-center gap-2 group"
                    >
                      <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Schedule Viewing
                    </button>
                  )}
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-zinc-400">
                      Free consultation • No obligation
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && residence.subImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <motion.div
              key={currentLightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={residence.subImages[currentLightboxIndex]}
                  alt={`Gallery image ${currentLightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
              {currentLightboxIndex + 1} / {residence.subImages.length}
            </div>
            
            {/* Thumbnails Strip in Lightbox */}
             <div className="absolute bottom-8 right-8 hidden lg:flex gap-2">
                {residence.subImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentLightboxIndex(idx);
                    }}
                    className={`relative w-16 h-12 rounded-md overflow-hidden transition-all ${
                      idx === currentLightboxIndex ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
