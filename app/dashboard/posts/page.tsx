"use client";

import { usePosts, useCreateInteraction } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";
import { Heart, MessageCircle, Share2, Plus } from "lucide-react";
import Link from "next/link";

export default function PostsPage() {
  const { data: posts, isLoading, error, refetch } = usePosts({ limit: 50 });
  const { mutate: createInteraction } = useCreateInteraction();

  const handleLike = (postId: string) => {
    createInteraction({ postId, type: "like" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Explore opportunities and updates from businesses
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Posts Feed */}
      {error ? (
        <ErrorState
          title="Failed to load posts"
          message="We couldn't fetch the posts. The endpoint might not be available yet."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
            <article
              key={post.id}
              className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.business?.name} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-muted-foreground">{post.content}</p>

              {/* Pricing */}
              {post.pricing && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                  <span className="font-semibold text-lg">
                    {post.pricing.currency} {post.pricing.price}
                  </span>
                  {post.pricing.priceType && (
                    <span className="text-sm">({post.pricing.priceType})</span>
                  )}
                </div>
              )}

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.slice(0, 4).map((image, idx) => (
                    <div
                      key={idx}
                      className="aspect-video bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Interactions */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>{post.likeCount}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.commentCount}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>{post.shareCount}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-12 text-center">
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
  );
}
