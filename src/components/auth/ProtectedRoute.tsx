
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MobileSkeletonList } from "@/components/mobile/MobileSkeletonList";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
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
  
  // User is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
