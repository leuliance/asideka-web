"use client";

import { useState } from "react";
import { useBusinesses, useBusinessCategories } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { Building2, Plus, Search, Globe, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: businesses, isLoading, error, refetch } = useBusinesses({ limit: 100 });
  const { data: categories } = useBusinessCategories();

  const filteredBusinesses =
    businesses?.payload?.filter((business) => {
      const matchesSearch = business.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || business.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Businesses</h1>
          <p className="text-muted-foreground">
            Discover and connect with businesses in your network
          </p>
        </div>
        <Link href="/dashboard/businesses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filters - Mobile: Select, Desktop: Chips */}
      <div>
        {/* Mobile Select */}
        <div className="md:hidden">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories?.payload?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.replace(/_/g, " ").replace(/&/g, " & ")}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Horizontal Chips */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All Categories
            </button>
            {categories?.payload?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category.name.replace(/_/g, " ").replace(/&/g, " & ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error ? (
        <ErrorState
          title="Failed to load businesses"
          message="We couldn't fetch the businesses. Please try again."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBusinesses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full pt-0">
              {/* Banner */}
              <div className="relative h-32 bg-linear-to-br from-blue-500 to-indigo-600 shrink-0">
                {business.bannerImage ? (
                  <Image
                    src={business.bannerImage}
                    alt={business.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="h-12 w-12 text-white/40" />
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="flex justify-center -mt-12 mb-4 shrink-0">
                <div className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden shadow-xl">
                  {business.profilePicture ? (
                    <Image
                      src={business.profilePicture}
                      alt={business.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                      {business.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <CardHeader className="text-center pb-3 shrink-0">
                <CardTitle className="text-lg line-clamp-1">{business.name}</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">
                  {business.category.replace(/_/g, " ").replace(/&/g, " & ")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                {business.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {business.bio}
                  </p>
                )}

                <div className="space-y-2">
                  {business.country && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {business.country}
                      </span>
                    </div>
                  )}

                  {business.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{business.email}</span>
                    </div>
                  )}

                  {business.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{business.phoneNumber}</span>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {business.website.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="shrink-0">
                <Link href={`/dashboard/businesses/${business.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No businesses found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory
              ? "Try adjusting your filters"
              : "Be the first to add a business"}
          </p>
          <Link href="/dashboard/businesses/new">
            <Button>Add Business</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
