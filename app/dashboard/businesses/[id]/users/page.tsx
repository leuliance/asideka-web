"use client";

import { useParams, useRouter } from "next/navigation";
import { useBusinessUsers } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, UserPlus, ArrowLeft } from "lucide-react";

export default function BusinessUsersPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  const { data: users, isLoading, error, refetch } = useBusinessUsers(businessId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mt-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Business Users</h1>
            <p className="text-muted-foreground">
              Manage users associated with this business
            </p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Failed to load users"
          message="We couldn't fetch the business users. Please try again."
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
      ) : users && users.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                    <CardDescription>{user.role || "Member"}</CardDescription>
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
            <h3 className="font-semibold mb-2">No users yet</h3>
            <p className="text-muted-foreground">
              Add users to collaborate on this business
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
