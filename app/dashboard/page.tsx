"use client";

import { usePosts, useBusinesses } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";
import { Building2, Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts({ limit: 10 });
  const { data: businesses, isLoading: businessesLoading } = useBusinesses({
    limit: 5,
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 border">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground mb-4">
          Here&apos;s what&apos;s happening in your business network
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/businesses/new">
            <Button>
              <Building2 className="mr-2 h-4 w-4" />
              Create Business
            </Button>
          </Link>
          <Link href="/dashboard/posts/new">
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <Link href="/dashboard/posts">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>

          {postsError ? (
            <div className="border rounded-lg p-8">
              <p className="text-sm text-muted-foreground text-center">
                Posts are temporarily unavailable. The API endpoint may be experiencing issues.
              </p>
            </div>
          ) : postsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : posts && posts.payload.length > 0 ? (
            <div className="space-y-4">
              {posts.payload.map((post) => (
                <div key={post.id} className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <p className="text-muted-foreground mt-1">
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
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t text-muted-foreground">
                    <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{post.likeCount}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.commentCount}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">{post.shareCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-12 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something with the community
              </p>
              <Link href="/dashboard/posts/new">
                <Button>Create Post</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Businesses */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="font-bold">Trending Businesses</h2>
            {businessesLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : businesses && businesses.payload.length > 0 ? (
              <div className="space-y-3">
                {businesses.payload.map((business) => (
                  <Link
                    key={business.id}
                    href={`/dashboard/businesses/${business.id}`}
                    className="block p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {business.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{business.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {business.category || "Business"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No businesses yet
              </p>
            )}
            <Link href="/dashboard/businesses">
              <Button variant="outline" className="w-full" size="sm">
                View all businesses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
