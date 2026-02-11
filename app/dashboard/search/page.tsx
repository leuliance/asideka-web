"use client";

import { useState } from "react";
import { useSearch } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Search, Building2, FileText } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { data: results, isLoading } = useSearch({ 
    query: debouncedQuery,
    limit: 50,
    page: 1,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground">
          Find businesses and posts across the network
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for businesses, posts, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <Button type="submit" size="lg">
          Search
        </Button>
      </form>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : results?.payload ? (
        <div className="space-y-8">
          {/* Businesses */}
          {results.payload.businesses.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Businesses ({results.payload.businesses.length})
              </h2>
              <div className="space-y-3">
                {results.payload.businesses.map((business) => (
                  <Link
                    key={business.id}
                    href={`/dashboard/businesses/${business.id}`}
                    className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        {business.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{business.name}</h3>
                    {business.category && (
                      <p className="text-sm text-muted-foreground">
                        {business.category.replace(/_/g, " ").replace(/&/g, " & ")}
                      </p>
                    )}
                  </div>
                </div>
                {business.bio && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {business.bio}
                  </p>
                )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {results.payload.posts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Posts ({results.payload.posts.length})
              </h2>
              <div className="space-y-3">
                {results.payload.posts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.business?.name} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                    {post.pricing && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
                        <span className="font-semibold">
                          {post.pricing.currency} {post.pricing.price}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {results.payload.businesses.length === 0 && results.payload.posts.length === 0 && (
            <div className="border rounded-lg p-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-12 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Start searching</h3>
          <p className="text-muted-foreground">
            Enter a search term to find businesses and posts
          </p>
        </div>
      )}
    </div>
  );
}
