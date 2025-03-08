
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LayoutDashboard } from 'lucide-react';

const DashboardPage = () => {
  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome to your fitness hub</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dashboard content will be added here in the future */}
          <div className="h-48 rounded-lg border border-border/40 flex items-center justify-center">
            <p className="text-muted-foreground">Dashboard content coming soon</p>
          </div>
          
          <div className="h-48 rounded-lg border border-border/40 flex items-center justify-center">
            <p className="text-muted-foreground">Dashboard content coming soon</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
