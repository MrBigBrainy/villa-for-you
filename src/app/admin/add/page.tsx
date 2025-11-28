"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddResidence() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    location: "",
    beds: 0,
    baths: 0,
    sqft: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "residences"), {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image: formData.image,
        location: formData.location,
        features: {
          beds: Number(formData.beds),
          baths: Number(formData.baths),
          sqft: Number(formData.sqft),
        },
        sold: false,
      });
      router.push("/admin");
    } catch (error) {
      console.error("Error adding residence:", error);
      alert("Failed to add residence");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm hover:text-zinc-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <h1 className="text-2xl font-serif mb-8">Add New Residence</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-zinc-600 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., $2,500,000"
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="e.g., /1.jpg"
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Malibu, CA"
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-zinc-600 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="baths"
                  value={formData.baths}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 mb-1">Square Feet</label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-zinc-900 text-white py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Residence"}
              </button>
              <Link
                href="/admin"
                className="flex-1 border border-zinc-300 text-zinc-900 py-3 hover:bg-zinc-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
