
import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import BottomNav from './BottomNav';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export function AppLayout({ children, showBottomNav = true }: AppLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={cn(
        "flex-1",
        showBottomNav && "pb-16" // Add padding when bottom nav is visible
      )}>
        {children}
      </main>
      
      {/* Show bottom nav for authenticated users on mobile */}
      {user && showBottomNav && <BottomNav />}
    </div>
  );
}
