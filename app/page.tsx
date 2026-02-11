import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, MessageSquare, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="font-bold text-xl">Asideka</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Connect, Collaborate,
              <span className="text-blue-600 dark:text-blue-400"> Grow</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A platform for businesses to connect, share opportunities, and grow together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything you need to grow your business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Building2 className="h-10 w-10 text-blue-600" />}
              title="Business Profiles"
              description="Create and showcase your business with detailed profiles"
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-green-600" />}
              title="Direct Messaging"
              description="Connect and communicate with other businesses instantly"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-purple-600" />}
              title="Market Insights"
              description="Get AI-powered insights and business news"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-orange-600" />}
              title="Collaboration"
              description="Find partners and collaborate on opportunities"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 Asideka. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
      <div className="p-3 rounded-full bg-muted">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
