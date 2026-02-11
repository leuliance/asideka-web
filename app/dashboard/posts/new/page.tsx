"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePost, useBusinesses } from "@/lib/hooks";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: createPost, isPending } = useCreatePost();
  const { data: businesses } = useBusinesses();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    businessId: user?.businessId || "",
    price: "",
    currency: "USD",
    priceType: "fixed" as "fixed" | "negotiable" | "range",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title: formData.title,
      content: formData.content,
      businessId: formData.businessId,
      ...(formData.price && {
        pricing: {
          price: parseFloat(formData.price),
          currency: formData.currency,
          priceType: formData.priceType,
        },
      }),
    };

    createPost(postData, {
      onSuccess: () => {
        router.push("/dashboard/posts");
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Post</h1>
          <p className="text-muted-foreground">
            Share an opportunity or update with the community
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="businessId" className="text-sm font-medium">
            Business *
          </label>
          <select
            id="businessId"
            name="businessId"
            value={formData.businessId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a business</option>
            {businesses?.payload?.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Give your post a catchy title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share details about your opportunity or update..."
          />
        </div>

        {/* Pricing Section */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Pricing (Optional)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="ETB">ETB</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priceType" className="text-sm font-medium">
                Price Type
              </label>
              <select
                id="priceType"
                name="priceType"
                value={formData.priceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fixed">Fixed</option>
                <option value="negotiable">Negotiable</option>
                <option value="range">Range</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
          <Link href="/dashboard/posts" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
