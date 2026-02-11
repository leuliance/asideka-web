"use client";

import { useState } from "react";
import { useDueDiligence, useRequestDueDiligence, useBusinesses } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { FileCheck, Loader2, Plus } from "lucide-react";

export default function DueDiligencePage() {
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

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessId: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    ownedBusinessName: "",
    dueDiligencePurpose: "",
    urgencyLevel: "medium",
    infomationUsage: "",
    additionalRequirements: "",
  });
  
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: requests, isLoading, error, refetch } = useDueDiligence({ 
    limit: 10, 
    page: page,
    query: searchQuery 
  });
  const { data: businesses } = useBusinesses({ limit: 100 });
  const { mutate: requestDueDiligence, isPending } = useRequestDueDiligence();

  console.log({ requests })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestDueDiligence(formData, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({
          businessName: "",
          businessId: "",
          fullname: "",
          email: "",
          phoneNumber: "",
          ownedBusinessName: "",
          dueDiligencePurpose: "",
          urgencyLevel: "medium",
          infomationUsage: "",
          additionalRequirements: "",
        });
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "rejected":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Due Diligence</h1>
            <p className="text-muted-foreground">
              Request and manage business verification
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats */}
        {requests?.metadata && (
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{requests.metadata.totalItems}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Current Page</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{requests.metadata.currentPage} / {requests.metadata.totalPages}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Per Page</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{requests.metadata.limit}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {requests.metadata.nextPage ? "More available" : "Last page"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Request Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Request Due Diligence</CardTitle>
            <CardDescription>
              Submit a verification request for a business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business</label>
                  <select
                    value={formData.businessId}
                    onChange={(e) => {
                      const selectedBusiness = businesses?.payload?.find(b => b.id === e.target.value);
                      setFormData({
                        ...formData,
                        businessId: e.target.value,
                        businessName: selectedBusiness?.name || "",
                      });
                    }}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a business</option>
                    {businesses?.payload?.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Business Name</label>
                  <input
                    type="text"
                    value={formData.ownedBusinessName}
                    onChange={(e) => setFormData({ ...formData, ownedBusinessName: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Urgency Level</label>
                  <select
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Diligence Purpose</label>
                <textarea
                  value={formData.dueDiligencePurpose}
                  onChange={(e) => setFormData({ ...formData, dueDiligencePurpose: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain the purpose of this due diligence request..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Information Usage</label>
                <textarea
                  value={formData.infomationUsage}
                  onChange={(e) => setFormData({ ...formData, infomationUsage: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How will you use this information?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Requirements</label>
                <textarea
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional requirements or notes..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {error ? (
        <ErrorState
          title="Failed to load requests"
          message="We couldn't fetch the due diligence requests. Please try again."
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
      ) : requests && requests.payload && requests.payload.length > 0 ? (
        <div className="space-y-4">
          {requests.payload.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{request.businessName}</CardTitle>
                    <CardDescription className="mt-1">
                      {request.fullname} • {formatDate(request.createdAt)}
                    </CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2 text-muted-foreground">{request.email}</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2 text-muted-foreground">{request.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium">Your Business:</span>
                    <span className="ml-2 text-muted-foreground">{request.ownedBusinessName}</span>
                  </div>
                  <div>
                    <span className="font-medium">Urgency:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      request.urgencyLevel === "urgent" ? "bg-red-100 text-red-700" :
                      request.urgencyLevel === "high" ? "bg-orange-100 text-orange-700" :
                      request.urgencyLevel === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {request.urgencyLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">Purpose:</p>
                  <p className="text-sm text-muted-foreground">{request.dueDiligencePurpose}</p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">Information Usage:</p>
                  <p className="text-sm text-muted-foreground">{request.infomationUsage}</p>
                </div>
                {request.additionalRequirements && (
                  <div>
                    <p className="font-medium text-sm mb-1">Additional Requirements:</p>
                    <p className="text-sm text-muted-foreground">{request.additionalRequirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {requests?.metadata && requests.metadata.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {requests.metadata.currentPage} of {requests.metadata.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={!requests.metadata.nextPage}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Submit a due diligence request to verify a business
            </p>
            <Button onClick={() => setShowForm(true)}>
              Create Request
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
