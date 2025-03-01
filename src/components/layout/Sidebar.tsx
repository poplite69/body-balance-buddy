
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Dumbbell, 
  Home, 
  Menu, 
  PenLine, 
  Pizza, 
  X, 
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { slideIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  // Determine if a route is active
  const isActive = (path: string) => location.pathname === path;

  // Handle closing sidebar on navigation in mobile view
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-72 bg-white border-r border-grip-neutral-100 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          mounted ? "transition-all" : "transition-none"
        )}
      >
        <div className="flex flex-col h-full pt-14">
          {/* Close button */}
          <div className="absolute top-4 right-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo */}
          <div className="px-6 py-4 flex items-center">
            <span className="font-bold text-grip-neutral-700 text-2xl">grip</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            <div className={slideIn(0.1)}>
              <Link
                to="/"
                className={cn("grip-nav-item", isActive("/") && "active")}
                onClick={handleNavigation}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </div>
            
            <div className={slideIn(0.2)}>
              <Link
                to="/workout"
                className={cn("grip-nav-item", isActive("/workout") && "active")}
                onClick={handleNavigation}
              >
                <Dumbbell className="h-5 w-5" />
                <span>Workouts</span>
              </Link>
            </div>
            
            <div className={slideIn(0.3)}>
              <Link
                to="/nutrition"
                className={cn("grip-nav-item", isActive("/nutrition") && "active")}
                onClick={handleNavigation}
              >
                <Pizza className="h-5 w-5" />
                <span>Nutrition</span>
              </Link>
            </div>
            
            <div className={slideIn(0.4)}>
              <Link
                to="/journal"
                className={cn("grip-nav-item", isActive("/journal") && "active")}
                onClick={handleNavigation}
              >
                <PenLine className="h-5 w-5" />
                <span>Journal</span>
              </Link>
            </div>
            
            <div className={slideIn(0.5)}>
              <Link
                to="/coach"
                className={cn("grip-nav-item", isActive("/coach") && "active")}
                onClick={handleNavigation}
              >
                <Sparkles className="h-5 w-5" />
                <span>AI Coach</span>
              </Link>
            </div>
          </nav>

          {/* Bottom content */}
          <div className="p-6 border-t border-grip-neutral-100">
            <div className="bg-grip-blue-light/50 rounded-lg p-4">
              <h4 className="font-medium text-grip-neutral-700 mb-1">Ready for more?</h4>
              <p className="text-sm text-grip-neutral-500 mb-3">
                Connect your wearables to get deeper insights
              </p>
              <Button className="w-full text-sm h-9 bg-white text-grip-blue hover:bg-grip-blue hover:text-white">
                Connect devices
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
