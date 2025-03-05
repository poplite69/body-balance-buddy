
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Dumbbell, 
  BarChart, 
  Calendar, 
  Clock, 
  Heart,
  LogIn
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Grip
        </Link>
        <div className="flex gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">
              Sign In
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              Create Account
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Track Your Fitness Journey
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Grip helps you track workouts, monitor progress, and achieve your fitness goals with simple, 
          powerful tools designed for every fitness level.
        </p>
        <Button asChild size="lg" className="mr-4">
          <Link to="/auth">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/workout">Try Demo</Link>
        </Button>
      </section>

      {/* Feature Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border">
              <Dumbbell className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Workout Tracking</h3>
              <p className="text-muted-foreground">
                Log your exercises, sets, reps, and weights to keep a detailed record of all your training sessions.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border">
              <BarChart className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Progress Analytics</h3>
              <p className="text-muted-foreground">
                Visualize your progress with detailed charts and metrics to understand your improvement over time.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border">
              <Calendar className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Workout Planning</h3>
              <p className="text-muted-foreground">
                Create custom workout templates and schedule your training sessions to stay consistent.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border">
              <Clock className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Rest Timer</h3>
              <p className="text-muted-foreground">
                Track rest periods between sets to optimize your workout intensity and recovery.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-border">
              <Heart className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Health Metrics</h3>
              <p className="text-muted-foreground">
                Monitor key health indicators like heart rate, weight, and body measurements to track overall wellness.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">And More...</h3>
                <Button asChild variant="link">
                  <Link to="/auth">Explore All Features</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-2xl font-bold text-primary">Grip</p>
            <p className="text-sm text-muted-foreground">Your fitness journey starts here</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-4">
              <Button variant="ghost" size="sm">About</Button>
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Grip Fitness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
