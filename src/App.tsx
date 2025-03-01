
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WorkoutPage from "./pages/WorkoutPage";
import FoodPage from "./pages/FoodPage";
import JournalPage from "./pages/JournalPage";
import AICoachPage from "./pages/AICoachPage";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance to manage data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents unnecessary refetches
      retry: 1, // Only retry failed requests once
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    },
  },
});

const App = () => (
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

export default App;
