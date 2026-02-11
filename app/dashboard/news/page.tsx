"use client";

import { useBusinessNews } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { Newspaper, ExternalLink, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
  const { data: news, isLoading, error, refetch } = useBusinessNews({ limit: 50 });

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown date";
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest business news and insights
        </p>
      </div>

      {error ? (
        <ErrorState
          title="Failed to load news"
          message="We couldn't fetch the business news. Please try again."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : news && news.payload && news.payload.length > 0 ? (
        <div className="space-y-4">
          {news.payload.map((article) => (
            <Card key={article.article_id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                {article.image_url && (
                  <div className="md:w-64 h-48 md:h-auto bg-muted shrink-0">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Newspaper className="h-4 w-4" />
                            <span>{article.source_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.pubDate)}</span>
                          </div>
                          {article.country && article.country.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="capitalize">{article.country[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.description}
                    </p>

                    {/* Categories/Keywords */}
                    {article.category && article.category.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.category.slice(0, 3).map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm" className="gap-2">
                        Read Full Article
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No news available</h3>
            <p className="text-muted-foreground">
              Check back later for business news and updates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
