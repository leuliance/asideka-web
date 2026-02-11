"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, MapPin, Briefcase, Award, Languages } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const profile = session?.user?.userProfile;

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="font-semibold mb-2">No profile data</h3>
            <p className="text-muted-foreground">
              Please log in to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {profile && (
        <>
          {/* Banner and Profile Picture */}
          <div className="relative">
            <div className="h-48 rounded-lg overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600">
              {profile.bannerImage && (
                <img
                  src={profile.bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute -bottom-16 left-8">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`${profile.firstname} ${profile.lastname}`}
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.firstname?.charAt(0)}
                  {profile.lastname?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">
                  {profile.firstname} {profile.lastname}
                </h1>
                {profile.profession && (
                  <p className="text-lg text-muted-foreground mt-1">{profile.profession}</p>
                )}
                {profile.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {profile.category}
                  </span>
                )}
              </div>
              <Button>Edit Profile</Button>
            </div>

            {profile.bio && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={`tel:${profile.phoneNumber}`}
                      className="text-blue-600 hover:underline"
                    >
                      {profile.phoneNumber}
                    </a>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                {profile.country && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {profile.country} {profile.countryCode && `(${profile.countryCode})`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {profile.certifications.map((cert: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-yellow-600 mt-1" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
