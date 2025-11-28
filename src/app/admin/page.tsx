"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { Pencil, Trash2, CheckCircle, LogOut, Plus } from "lucide-react";

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
  const { user, setUser } = useAuthStore();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-serif">Manage Residences</h2>
          <Link
            href="/admin/add"
            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Residence
          </Link>
        </div>

        {residences.length === 0 ? (
          <div className="bg-white p-8 text-center border border-zinc-200">
            <p className="text-zinc-500">No residences found. Add your first residence!</p>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="text-left p-4 text-sm font-medium text-zinc-600">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-600">Location</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-600">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-600">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {residences.map((residence) => (
                  <tr key={residence.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="p-4">
                      <div className="font-medium">{residence.name}</div>
                      <div className="text-xs text-zinc-500">
                        {residence.features.beds} beds • {residence.features.baths} baths
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-600">{residence.location}</td>
                    <td className="p-4 text-sm font-medium">{residence.price}</td>
                    <td className="p-4">
                      {residence.sold ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1">SOLD</span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1">AVAILABLE</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/edit/${residence.id}`}
                          className="p-2 hover:bg-zinc-100 border border-zinc-200"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-zinc-600" />
                        </Link>
                        <button
                          onClick={() => handleMarkAsSold(residence.id, residence.sold || false)}
                          className="p-2 hover:bg-zinc-100 border border-zinc-200"
                          title={residence.sold ? "Mark as Available" : "Mark as Sold"}
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              residence.sold ? "text-green-600" : "text-zinc-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(residence.id)}
                          className="p-2 hover:bg-red-50 border border-zinc-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
