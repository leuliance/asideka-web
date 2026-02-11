"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Globe, Mail, Phone, MapPin, Building2, Users, Link2 } from "lucide-react";
import Image from "next/image";

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  // For now, we'll show a placeholder since we don't have a single business API endpoint
  // You can add useQuery to fetch business by ID when the API is available

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Businesses
      </Button>

      {/* Banner Section */}
      <div className="relative h-64 rounded-lg overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="h-24 w-24 text-white/30" />
        </div>
        
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-900 overflow-hidden shadow-xl">
            <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl">
              B
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Business Details</h1>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            Category Name
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href={`/dashboard/businesses/${businessId}/users`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage business users</p>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/dashboard/businesses/${businessId}/affiliations`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Affiliations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View affiliated partners</p>
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">✓ Verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                Business details will appear here once the API endpoint is available.
                Business ID: {businessId}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      Country information
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:contact@business.com"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Email address
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a
                      href="tel:+1234567890"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Phone number
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Website URL
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="border rounded-lg p-6 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> To display full business details, you'll need to add a
            "Get Business by ID" API endpoint to your backend. The endpoint should be
            something like <code className="px-2 py-1 bg-background rounded">GET /businesses/{businessId}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
