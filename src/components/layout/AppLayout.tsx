
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  console.log("AppLayout rendering");
  
  return (
    <div className="min-h-screen bg-grip-neutral-50 flex">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex flex-col flex-1 md:pl-72 min-h-screen">
        <Navbar toggleSidebar={() => {}} />
        
        <main className="flex-1 pt-16 px-4 md:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
