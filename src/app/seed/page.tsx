"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { residences } from "@/data/residences";

export default function SeedData() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setMessage("Seeding data...");

    try {
      for (const residence of residences) {
        await addDoc(collection(db, "residences"), {
          name: residence.name,
          description: residence.description,
          price: residence.price,
          image: residence.image,
          location: residence.location,
          features: residence.features,
          sold: false,
        });
      }
      setMessage(`Successfully seeded ${residences.length} residences!`);
    } catch (error) {
      console.error("Error seeding data:", error);
      setMessage("Error seeding data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="bg-white p-8 border border-zinc-200 w-full max-w-md text-center">
        <h1 className="text-2xl font-serif mb-6">Seed Database</h1>
        <p className="text-sm text-zinc-600 mb-6">
          Click the button below to populate Firestore with initial residence data.
          <br />
          <span className="text-xs text-red-600">Note: This will add duplicate data if run multiple times.</span>
        </p>
        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-zinc-900 text-white py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50 mb-4"
        >
          {loading ? "Seeding..." : "Seed Data"}
        </button>
        {message && (
          <div className="p-3 bg-zinc-100 text-zinc-700 text-sm">{message}</div>
        )}
      </div>
    </div>
  );
}
