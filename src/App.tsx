
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutPage from "./pages/WorkoutPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { AppLayout } from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  console.log("App is rendering - mobile first version");
  
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
