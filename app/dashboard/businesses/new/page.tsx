"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateBusiness, useBusinessCategories } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, X, Plus } from "lucide-react";
import Link from "next/link";

export default function NewBusinessPage() {
  const router = useRouter();
  const { mutate: createBusiness, isPending } = useCreateBusiness();
  const { data: categories } = useBusinessCategories();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    country: "",
    countryCode: "",
    bio: "",
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddPhoto = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (photoUrl.trim() && photos.length < 5) {
      setPhotos([...photos, photoUrl.trim()]);
      setPhotoUrl("");
    }
  };

  const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPhotoUrl(url);
    
    // Auto-add photo if it looks like a valid URL and user presses Enter or pastes
    if (url.trim() && (url.startsWith('http://') || url.startsWith('https://')) && photos.length < 5) {
      // Debounce: wait for user to finish typing/pasting
      const timeoutId = setTimeout(() => {
        if (url === photoUrl) { // Only add if URL hasn't changed
          setPhotos([...photos, url.trim()]);
          setPhotoUrl("");
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBusiness(
      {
        ...formData,
        photos,
      },
      {
        onSuccess: (response) => {
          // Only navigate if the business was actually created successfully
          if (response.status === "success" && response.payload) {
            router.push("/dashboard/businesses");
          }
          // If failed, stay on page (error toast already shown by hook)
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/businesses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Business</h1>
          <p className="text-muted-foreground">
            Add your business to the network
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border rounded-lg p-6 space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter business name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories?.payload?.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name.replace(/_/g, " ").replace(/&/g, " & ")}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="e.g., Ghana"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country Code *</label>
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                required
                placeholder="e.g., GH"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio *</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe your business..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Photos (up to 5)</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoUrl}
                onChange={handlePhotoUrlChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPhoto(e);
                  }
                }}
                placeholder="Paste image URL here and press Enter..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={() => handleAddPhoto()}
                disabled={!photoUrl.trim() || photos.length >= 5}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            {/* Live preview of current URL */}
            {photoUrl.trim() && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) && (
              <div className="border rounded-lg p-2 bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=Invalid+URL";
                  }}
                />
              </div>
            )}
            
            {/* Photo Preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x200?text=Invalid+URL";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/businesses">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Business"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
