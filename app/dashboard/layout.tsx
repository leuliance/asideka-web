"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Home,
  LayoutGrid,
  MessageSquare,
  Plus,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Newspaper,
  FileCheck,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Businesses", href: "/dashboard/businesses", icon: Building2 },
    { name: "Posts", href: "/dashboard/posts", icon: LayoutGrid },
    { name: "News", href: "/dashboard/news", icon: Newspaper },
    { name: "Due Diligence", href: "/dashboard/due-diligence", icon: FileCheck },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Search", href: "/dashboard/search", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="font-bold text-xl">Asideka</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/posts/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Post</span>
              </Button>
            </Link>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l">
              <ThemeToggle />
              <Link href="/dashboard/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-4 space-y-1 border-t">
                <div className="px-3 py-2">
                  <ThemeToggle />
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
