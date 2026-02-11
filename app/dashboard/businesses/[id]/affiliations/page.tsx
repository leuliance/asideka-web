"use client";

import { useParams, useRouter } from "next/navigation";
import { useBusinessAffiliations } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, ArrowLeft } from "lucide-react";

export default function BusinessAffiliationsPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  const { data: affiliations, isLoading, error, refetch } = useBusinessAffiliations(businessId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Business Affiliations</h1>
          <p className="text-muted-foreground">
            View affiliated users and partners
          </p>
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Failed to load affiliations"
          message="We couldn't fetch the business affiliations. Please try again."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : affiliations && affiliations.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {affiliations.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                    <CardDescription>Affiliated Partner</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {user.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.phoneNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No affiliations yet</h3>
            <p className="text-muted-foreground">
              Affiliations will appear here when users connect
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
