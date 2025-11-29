"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SiteSettings {
  webName: string;
  address: string;
  email: string;
  phone: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    webName: "Villa Pik",
    address: "Phuket, Thailand",
    email: "pikpik@villapik.com",
    phone: "+66 123 456 789",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "setting", "main");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      }
      console.log(docSnap.data())
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await setDoc(doc(db, "setting", "main"), settings);
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-zinc-900 mb-2">Settings</h1>
            <p className="text-zinc-500">Manage your website's global configuration</p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-8"
          >
            {/* General Settings */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-zinc-900 border-b border-zinc-100 pb-4">
                General Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={settings.webName}
                    onChange={(e) => setSettings({ ...settings, webName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    placeholder="e.g. Villa Pik"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    This name will appear in the navbar and footer.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-zinc-900 border-b border-zinc-100 pb-4">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    placeholder="e.g. 123 Paradise Road, Phuket"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    placeholder="e.g. contact@villapik.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    placeholder="e.g. +66 123 456 789"
                  />
                </div>
              </div>
            </div>

            {/* Message & Action */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
              <div className="flex-1">
                {message && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm font-medium ${
                      message.type === "success" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {message.text}
                  </motion.p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/20"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
