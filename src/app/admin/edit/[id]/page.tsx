"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/firebase/firebase";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function EditResidence({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
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
    mapIframe: "",
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentAmenity, setCurrentAmenity] = useState("");

  const addAmenity = () => {
    if (!currentAmenity.trim()) return;
    setAmenities(prev => [...prev, currentAmenity.trim()]);
    setCurrentAmenity("");
  };

  const removeAmenity = (index: number) => {
    setAmenities(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        fetchResidence();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchResidence = async () => {
    try {
      const docRef = doc(db, "residences", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const residenceData = {
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          location: data.location,
          beds: data.features.beds,
          baths: data.features.baths,
          sqft: data.features.sqft,
          mapIframe: data.mapIframe || "",
        };
        setFormData(residenceData);
        setAmenities(data.amenities || []);
        setImagePreview(data.image);
        toast.success("Residence data loaded successfully");
      } else {
        toast.error("Residence not found");
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error fetching residence:", error);
      toast.error("Failed to load residence data");
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image;

    setUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `residences/${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      
      toast.success("Image uploaded successfully");
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Updating residence...");

    try {
      let imageUrl = formData.image;
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const docRef = doc(db, "residences", id);
      await updateDoc(docRef, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image: imageUrl,
        location: formData.location,
        features: {
          beds: Number(formData.beds),
          baths: Number(formData.baths),
          sqft: Number(formData.sqft),
        },
        mapIframe: formData.mapIframe,
        amenities: amenities,
      });
      
      toast.success("Residence updated successfully!", { id: loadingToast });
      
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (error) {
      console.error("Error updating residence:", error);
      toast.error("Failed to update residence", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Toaster position="top-right" />
      
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm hover:text-zinc-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <h1 className="text-2xl font-serif mb-8">Edit Residence</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-8">
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm text-zinc-600 mb-2">Residence Image</label>
              {imagePreview && (
                <div className="mb-4 relative w-full h-48 bg-zinc-100">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 border border-zinc-300 p-3 hover:bg-zinc-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Choose New Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-zinc-500 mt-2">Max file size: 5MB. Supported formats: JPG, PNG, WebP</p>
            </div>

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
                placeholder="e.g., ฿25,000,000"
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

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Google Map Iframe</label>
              <textarea
                name="mapIframe"
                value={formData.mapIframe}
                onChange={handleChange}
                placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                rows={4}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900 font-mono text-sm"
              />
              <p className="text-xs text-zinc-500 mt-1">Paste the full iframe code from Google Maps here.</p>
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

            {/* Features Section */}
            <div className="space-y-4 border-t border-zinc-100 pt-8">
              <h2 className="text-lg font-medium text-zinc-900">Amenities & Features</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentAmenity}
                  onChange={(e) => setCurrentAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  placeholder="Add a feature (e.g., Private Pool)"
                  className="flex-1 border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-full text-sm text-zinc-700">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(idx)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-zinc-900 text-white py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : uploading ? "Uploading..." : "Update Residence"}
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
