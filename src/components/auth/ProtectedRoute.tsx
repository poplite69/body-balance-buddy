
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MobileSkeletonList } from "@/components/mobile/MobileSkeletonList";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  
  // Show mobile-optimized loading skeleton while checking authentication status
  if (loading) {
    return (
      <div className="w-full p-4 space-y-4">
        {/* Mobile-like header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        
        {/* Content area skeleton */}
        <Skeleton className="h-32 w-full rounded-lg" />
        
        {/* List skeleton - optimized for mobile */}
        <MobileSkeletonList rows={4} />
      </div>
    );
  }
  
  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="p-8 bg-red-50 border border-red-200 rounded-md text-red-700 text-center">
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  // User is authenticated and has proper permissions, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
