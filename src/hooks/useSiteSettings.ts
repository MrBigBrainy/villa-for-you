"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

interface SiteSettings {
  webName: string;
  address: string;
  email: string;
  phone: string;
}

const defaultSettings: SiteSettings = {
  webName: "Villa Pik",
  address: "Phuket, Thailand",
  email: "pikpik@villapik.com",
  phone: "+66 123 456 789",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "setting", "main");
    
    // Real-time listener
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SiteSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching site settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
