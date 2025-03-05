
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutPage from "./pages/WorkoutPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { AppLayout } from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import "./App.css";

function App() {
  // Enable service worker for offline capabilities
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // This would be where we register the service worker
        // For now, we're just logging that it's available
        console.log('Service worker is available for offline capabilities');
      });
    }
    
    // Listen for connection changes with Supabase
    const channel = supabase.channel('system');
    
    channel.subscribe((status) => {
      console.log('Supabase realtime status:', status);
    });
    
    return () => {
      // Clean up the subscription by removing the channel
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route 
          path="/" 
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          } 
        />
        <Route 
          path="/workout" 
          element={
            <AppLayout>
              <ProtectedRoute>
                <WorkoutPage />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="/auth" 
          element={
            <AppLayout showBottomNav={false}>
              <AuthPage />
            </AppLayout>
          } 
        />
        <Route 
          path="*" 
          element={
            <AppLayout>
              <div className="p-8">404 Not Found</div>
            </AppLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
