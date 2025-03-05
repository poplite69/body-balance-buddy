
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight,
  ExternalLink,
  LogOut
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold text-foreground flex items-center gap-2">
          Grip
        </Link>
        <div className="flex gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/workout">Workouts</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth?tab=signup">Create Account</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <p className="mb-3 text-sm flex items-center w-fit gap-1 text-muted-foreground">
            Loved by 10k+ athletes like you
            <ArrowRight className="h-3 w-3 ml-1" />
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            Track your fitness journey
          </h1>
          <p className="text-muted-foreground text-lg mb-5 max-w-2xl">
            A beautifully designed fitness tracking application that helps you monitor workouts, 
            analyze progress, and achieve your goals.
          </p>
          <div className="flex flex-wrap gap-4">
            {user ? (
              <Button asChild size="lg">
                <Link to="/workout">My Workouts</Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link to="/workout">
                Try Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-4 md:px-8 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Core Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg p-6 border border-border/40 transition-colors">
              <h3 className="text-xl font-bold mb-2">Workout Tracking</h3>
              <p className="text-muted-foreground">
                Log exercises, sets, reps, and weights with an intuitive interface designed for efficiency.
              </p>
            </div>
            
            <div className="rounded-lg p-6 border border-border/40 transition-colors">
              <h3 className="text-xl font-bold mb-2">Progress Analytics</h3>
              <p className="text-muted-foreground">
                Visualize your progress with detailed charts and metrics to understand your improvement over time.
              </p>
            </div>
            
            <div className="rounded-lg p-6 border border-border/40 transition-colors">
              <h3 className="text-xl font-bold mb-2">Workout Planning</h3>
              <p className="text-muted-foreground">
                Create custom workout templates and schedule your training sessions to stay consistent.
              </p>
            </div>

            <div className="rounded-lg p-6 border border-border/40 transition-colors">
              <h3 className="text-xl font-bold mb-2">Rest Timer</h3>
              <p className="text-muted-foreground">
                Track rest periods between sets to optimize your workout intensity and recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-24 px-4 md:px-8 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Examples</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4">
            <Button variant="outline" className="rounded-full">Workouts</Button>
            <Button variant="outline" className="rounded-full">Dashboard</Button>
            <Button variant="outline" className="rounded-full">Analytics</Button>
            <Button variant="outline" className="rounded-full">Planning</Button>
            <Button variant="outline" className="rounded-full">Nutrition</Button>
          </div>
          
          <div className="mt-8 rounded-lg border border-border/40 h-96 flex items-center justify-center">
            <p className="text-muted-foreground">Interactive demo will be displayed here</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <p className="text-lg font-bold text-foreground flex items-center gap-2">
              Grip
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              © {new Date().getFullYear()} Grip Fitness. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Resources</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">Documentation</Button>
              <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">API</Button>
              <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">Privacy</Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Social</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground flex items-center gap-1">
                GitHub
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground flex items-center gap-1">
                Twitter
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground flex items-center gap-1">
                Discord
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
