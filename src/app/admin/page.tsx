"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { Pencil, Trash2, CheckCircle, Plus, MapPin, Bed, Bath, Square } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

interface Residence {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  location: string;
  features: {
    beds: number;
    baths: number;
    sqft: number;
  };
  sold?: boolean;
}

export default function AdminDashboard() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        fetchResidences();
      }
    });

    return () => unsubscribe();
  }, [router, setUser]);

  const fetchResidences = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "residences"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Residence[];
      setResidences(data);
    } catch (error) {
      console.error("Error fetching residences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this residence?")) return;

    try {
      await deleteDoc(doc(db, "residences", id));
      setResidences(residences.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting residence:", error);
      alert("Failed to delete residence");
    }
  };

  const handleMarkAsSold = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "residences", id), {
        sold: !currentStatus,
      });
      setResidences(
        residences.map((r) =>
          r.id === id ? { ...r, sold: !currentStatus } : r
        )
      );
    } catch (error) {
      console.error("Error updating residence:", error);
      alert("Failed to update residence");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-serif text-zinc-900 mb-2">Residences</h1>
              <p className="text-zinc-500">Manage your property listings</p>
            </div>
            <Link
              href="/admin/add"
              className="group flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-all duration-300 shadow-lg shadow-zinc-900/20 hover:shadow-zinc-900/30 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Add New Residence</span>
            </Link>
          </div>

          {/* Content */}
          {residences.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-3xl text-center border border-dashed border-zinc-300"
            >
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-medium text-zinc-900 mb-2">No residences yet</h3>
              <p className="text-zinc-500 mb-6">Start by adding your first property listing.</p>
              <Link
                href="/admin/add"
                className="inline-flex items-center gap-2 text-zinc-900 font-medium hover:underline"
              >
                Create Listing
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence>
                {residences.map((residence, index) => (
                  <motion.div
                    key={residence.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow flex gap-6 items-center group"
                  >
                    {/* Image */}
                    <div className="w-48 h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                      <img 
                        src={residence.image} 
                        alt={residence.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {residence.sold && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="text-white font-medium tracking-wider px-3 py-1 border border-white/30 rounded-full text-sm bg-black/30">SOLD</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-serif text-zinc-900 truncate">{residence.name}</h3>
                          <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            {residence.location}
                          </div>
                        </div>
                        <div className="text-lg font-medium text-zinc-900">
                          {residence.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          <span>{residence.features.beds} Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4" />
                          <span>{residence.features.baths} Baths</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          <span>{residence.features.sqft} sqft</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-6 border-l border-zinc-100">
                      <button
                        onClick={() => handleMarkAsSold(residence.id, residence.sold || false)}
                        className={`p-3 rounded-xl transition-colors ${
                          residence.sold 
                            ? "bg-green-50 text-green-600 hover:bg-green-100" 
                            : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                        }`}
                        title={residence.sold ? "Mark as Available" : "Mark as Sold"}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      
                      <Link
                        href={`/admin/edit/${residence.id}`}
                        className="p-3 rounded-xl bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(residence.id)}
                        className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
