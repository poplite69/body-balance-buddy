
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import WorkoutPage from "./pages/WorkoutPage";
import FoodPage from "./pages/FoodPage";
import JournalPage from "./pages/JournalPage";
import AICoachPage from "./pages/AICoachPage";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance with proper configuration for v5
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Add debugging
console.log("App is initializing");

const App = () => {
  console.log("App is rendering");
  
  // Setup for mobile
  useEffect(() => {
    // Prevent browser-level touch actions like pull-to-refresh
    document.body.addEventListener('touchmove', (e) => {
      if (e.target === document.body) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Handle status bar height on iOS
    document.documentElement.style.setProperty(
      '--sat', 
      `env(safe-area-inset-top, 0px)`
    );
    document.documentElement.style.setProperty(
      '--sab', 
      `env(safe-area-inset-bottom, 0px)`
    );
    
    // Log when app is ready
    console.log("Mobile app setup complete");
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/nutrition" element={<FoodPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/coach" element={<AICoachPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
