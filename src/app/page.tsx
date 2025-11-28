"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ResidenceCard from "@/components/ResidenceCard";
import { Residence, residences as staticResidences } from "@/data/residences";

export default function Home() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResidences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "residences"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Residence[];
        
        if (data.length === 0) {
          // No data in Firestore, use static data
          console.warn("No residences found in Firestore. Using static data. Visit /seed to populate the database.");
          setResidences(staticResidences);
          setError("Using sample data. Visit /seed to populate the database.");
        } else {
          // Filter out sold residences from public view
          setResidences(data.filter(r => !r.sold));
        }
      } catch (err: any) {
        console.error("Error fetching residences:", err);
        // Fallback to static data
        setResidences(staticResidences);
        setError("Could not connect to database. Using sample data.");
      } finally {
        setLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Firestore request timed out. Using static data.");
        setResidences(staticResidences);
        setError("Database connection timed out. Using sample data.");
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    fetchResidences();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      <section id="residences" className="py-20 md:py-32 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">
              Our Residences
            </h2>
            <p className="text-zinc-500 font-light tracking-wide uppercase">
              Choose your perfect sanctuary
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 text-sm text-center">
              ⚠️ {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center text-zinc-500 py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mb-4"></div>
              <p>Loading residences...</p>
            </div>
          ) : residences.length === 0 ? (
            <div className="text-center text-zinc-500 py-20">No residences available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {residences.map((residence) => (
                <ResidenceCard key={residence.id} residence={residence} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Features />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
