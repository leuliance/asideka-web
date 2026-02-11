"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phoneNumber: "",
  });
  const { register, isRegisterPending } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between text-white">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          <span className="font-bold text-2xl">Asideka</span>
        </Link>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            Join the business community today
          </h1>
          <p className="text-xl text-blue-100">
            Create your account and start connecting with businesses
          </p>
        </div>
        <div className="text-sm text-blue-200">
          &copy; 2026 Asideka. All rights reserved.
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
              <Building2 className="h-8 w-8" />
              <span className="font-bold text-2xl">Asideka</span>
            </Link>
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="mt-2 text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your-username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number (Optional)
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isRegisterPending}
            >
              {isRegisterPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
