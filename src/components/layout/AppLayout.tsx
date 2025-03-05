
import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import BottomNav from './BottomNav';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export function AppLayout({ children, showBottomNav = true }: AppLayoutProps) {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Offline indicator */}
      {!isOnline && (
        <Alert variant="destructive" className="rounded-none sticky top-0 z-50">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertDescription>
            You're offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}
      
      <main className={cn(
        "flex-1",
        showBottomNav && "pb-16", // Add padding when bottom nav is visible
        !isOnline && "offline-mode" // Add class for offline specific styling if needed
      )}>
        {children}
      </main>
      
      {/* Show bottom nav for authenticated users on mobile */}
      {user && showBottomNav && <BottomNav />}
    </div>
  );
}
