"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoginPending } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
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
            Welcome back to your business community
          </h1>
          <p className="text-xl text-blue-100">
            Connect with businesses, share opportunities, and grow together
          </p>
        </div>
        <div className="text-sm text-blue-200">
          &copy; 2026 Asideka. All rights reserved.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
              <Building2 className="h-8 w-8" />
              <span className="font-bold text-2xl">Asideka</span>
            </Link>
            <h2 className="text-3xl font-bold">Sign in to your account</h2>
            <p className="mt-2 text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your-username"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoginPending}
            >
              {isLoginPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
