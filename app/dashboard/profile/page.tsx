"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUpdateProfile } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, MapPin, Briefcase, Award, Languages, User as UserIcon, Edit, X, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const profile = session?.user?.userProfile;
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const displayData = profile || {
    firstname: user?.firstName || user?.name?.split(' ')[0] || '',
    lastname: user?.lastName || user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    id: user?.id || '',
    category: user?.role || '',
    identityId: user?.businessId || '',
    profilePicture: '',
    bannerImage: '',
    bio: '',
    country: '',
    countryCode: '',
    phoneNumber: '',
    website: '',
    profession: '',
    skills: [],
    languages: [],
    certifications: []
  };

  const [formData, setFormData] = useState({
    firstname: displayData.firstname || '',
    lastname: displayData.lastname || '',
    bio: displayData.bio || '',
    country: displayData.country || '',
    countryCode: displayData.countryCode || '',
    phoneNumber: displayData.phoneNumber || '',
    email: displayData.email || '',
    website: displayData.website || '',
    profession: displayData.profession || '',
    profilePicture: displayData.profilePicture || '',
    bannerImage: displayData.bannerImage || '',
  });

  const [skills, setSkills] = useState<string[]>(displayData.skills || []);
  const [languages, setLanguages] = useState<string[]>(displayData.languages || []);
  const [certifications, setCertifications] = useState<string[]>(displayData.certifications || []);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <UserIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Not logged in</h3>
            <p className="text-muted-foreground">
              Please log in to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(
      {
        ...formData,
        skills,
        languages,
        certifications,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          // Refresh session to get updated data
          updateSession();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      firstname: displayData.firstname || '',
      lastname: displayData.lastname || '',
      bio: displayData.bio || '',
      country: displayData.country || '',
      countryCode: displayData.countryCode || '',
      phoneNumber: displayData.phoneNumber || '',
      email: displayData.email || '',
      website: displayData.website || '',
      profession: displayData.profession || '',
      profilePicture: displayData.profilePicture || '',
      bannerImage: displayData.bannerImage || '',
    });
    setSkills(displayData.skills || []);
    setLanguages(displayData.languages || []);
    setCertifications(displayData.certifications || []);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner and Profile Picture */}
      <div className="relative">
        <div className="h-48 rounded-lg overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600">
          {displayData.bannerImage && (
            <img
              src={displayData.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-16 left-8">
          {displayData.profilePicture ? (
            <img
              src={displayData.profilePicture}
              alt={`${displayData.firstname} ${displayData.lastname}`}
              className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 object-cover"
            />
          ) : (
            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
              {displayData.firstname?.charAt(0) || user?.name?.charAt(0) || 'U'}
              {displayData.lastname?.charAt(0) || user?.name?.charAt(1) || ''}
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {displayData.firstname || displayData.lastname
                ? `${displayData.firstname} ${displayData.lastname}`.trim()
                : user?.name || 'User'
              }
            </h1>
            {displayData.profession && (
              <p className="text-lg text-muted-foreground mt-1">{displayData.profession}</p>
            )}
            {displayData.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                {displayData.category}
              </span>
            )}
            {!displayData.profession && !displayData.category && (
              <p className="text-muted-foreground mt-1">Complete your profile to add more information</p>
            )}
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profession</label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Software Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country Code</label>
                    <input
                      type="text"
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., GH"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profile Picture URL</label>
                    <input
                      type="url"
                      value={formData.profilePicture}
                      onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Banner Image URL</label>
                    <input
                      type="url"
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSkill.trim()) {
                            setSkills([...skills, newSkill.trim()]);
                            setNewSkill('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a skill and press Enter"
                    />
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Languages</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newLanguage.trim()) {
                            setLanguages([...languages, newLanguage.trim()]);
                            setNewLanguage('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a language and press Enter"
                    />
                  </div>
                  {languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {languages.map((language, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center gap-2"
                        >
                          {language}
                          <button
                            type="button"
                            onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Certifications</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newCertification.trim()) {
                            setCertifications([...certifications, newCertification.trim()]);
                            setNewCertification('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a certification and press Enter"
                    />
                  </div>
                  {certifications.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 border rounded-lg"
                        >
                          <span className="text-sm">{cert}</span>
                          <button
                            type="button"
                            onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {displayData.bio && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{displayData.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        {(displayData.email || displayData.phoneNumber || displayData.website || displayData.country) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayData.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`mailto:${displayData.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {displayData.email}
                  </a>
                </div>
              )}
              {displayData.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`tel:${displayData.phoneNumber}`}
                    className="text-blue-600 hover:underline"
                  >
                    {displayData.phoneNumber}
                  </a>
                </div>
              )}
              {displayData.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={displayData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {displayData.website}
                  </a>
                </div>
              )}
              {displayData.country && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {displayData.country} {displayData.countryCode && `(${displayData.countryCode})`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {displayData.skills && displayData.skills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayData.skills.map((skill: string, idx: number) => (
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
        {displayData.languages && displayData.languages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayData.languages.map((language: string, idx: number) => (
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
        {displayData.certifications && displayData.certifications.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {displayData.certifications.map((cert: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-yellow-600 mt-1" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* User Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">User ID:</span>
              <span className="ml-2 text-muted-foreground font-mono">{displayData.id}</span>
            </div>
            {displayData.identityId && (
              <div>
                <span className="font-medium">Business ID:</span>
                <span className="ml-2 text-muted-foreground font-mono">{displayData.identityId}</span>
              </div>
            )}
            {displayData.category && (
              <div>
                <span className="font-medium">Role:</span>
                <span className="ml-2 text-muted-foreground">{displayData.category}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
