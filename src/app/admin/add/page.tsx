"use client";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import Link from "next/link";
import { ArrowLeft, X, Plus, Image as ImageIcon, Upload } from "lucide-react";
import { storage } from "@/firebase/firebase";

export default function AddResidence() {
   const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentAmenity, setCurrentAmenity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    beds: 0,
    baths: 0,
    sqft: 0,
    mapIframe: "",
  });

  async function uploadImage(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string | null> {
  if (!file) return null;

  const fileRef = ref(storage, `images/${Date.now()}-${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadImage(file, (progress) => setUploadProgress(progress));
      if (url) setImageUrl(url);
    } catch (error) {
      console.error("Error uploading main image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      // Upload sequentially to show overall progress roughly, or just show indeterminate
      // For simplicity, we'll just track the last one or average. 
      // Let's do parallel uploads but just show "Uploading..." with a spinner or similar if complex.
      // Or we can just pass a dummy progress for now since user asked for "progress or percent".
      // We'll calculate average progress.
      
      const totalFiles = files.length;
      let completedFiles = 0;
      
      const uploadPromises = Array.from(files).map(file => 
        uploadImage(file, (progress) => {
          // This is a bit complex to aggregate perfectly without individual tracking, 
          // but we can approximate or just show the progress of the current batch.
          // Let's just show a simple "Uploading..." state for gallery for now, or 
          // if we want percent, we need to sum bytes. 
          // Simplified: just update progress based on completed count.
        }).then(url => {
          completedFiles++;
          setUploadProgress((completedFiles / totalFiles) * 100);
          return url;
        })
      );

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);
      setGalleryUrls(prev => [...prev, ...validUrls]);
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      alert("Failed to upload gallery images");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

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
        image: imageUrl,
        subImages: galleryUrls,
        location: formData.location,
        features: {
          beds: Number(formData.beds),
          baths: Number(formData.baths),
          sqft: Number(formData.sqft),
        },
        amenities: amenities,
        mapIframe: formData.mapIframe,
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
          <div className="space-y-8">
            
            {/* Media Section */}
            <div className="space-y-6 border-b border-zinc-100 pb-8">
              <h2 className="text-lg font-medium text-zinc-900">Media</h2>
              
              {/* Main Image */}
              <div>
                <label className="block text-sm text-zinc-600 mb-2">Main Image</label>
                <div className="space-y-4">
                  {imageUrl ? (
                    <div className="relative w-full aspect-video bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-lg overflow-hidden group">
                      <img src={imageUrl} alt="Main" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center text-zinc-400">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm">No image selected</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleMainImageUpload} 
                      className="hidden" 
                      id="main-image-upload"
                    />
                    <label 
                      htmlFor="main-image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {imageUrl ? "Change Image" : "Upload Main Image"}
                    </label>
                    {uploading && (
                      <span className="text-sm text-zinc-500 font-medium">
                        Uploading... {Math.round(uploadProgress)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm text-zinc-600 mb-2">Gallery Images</label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square bg-zinc-50 rounded-lg overflow-hidden group">
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-colors">
                    <Plus className="w-6 h-6 text-zinc-300 mb-1" />
                    <span className="text-xs text-zinc-400">Add</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleGalleryUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900">Details</h2>
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
