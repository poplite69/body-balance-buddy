
import { Bell, Menu, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  const [navbarTransparent, setNavbarTransparent] = useState(true);

  // Add scroll listener to make navbar opaque on scroll
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        setNavbarTransparent(false);
      } else {
        setNavbarTransparent(true);
      }
    });
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center px-4 md:px-6",
      navbarTransparent ? "bg-transparent" : "bg-white/80 backdrop-blur-md border-b border-grip-neutral-100"
    )}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="flex items-center">
            <span className="font-bold text-grip-neutral-700 text-xl hidden md:block">grip</span>
          </a>
        </div>

        <div className="flex items-center w-full max-w-lg mx-6 relative hidden md:flex">
          <Search className="h-4 w-4 absolute left-3 text-grip-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            className="grip-input pl-10 w-full h-9 bg-grip-neutral-50/80"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-grip-neutral-600 hover:text-grip-neutral-800">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-grip-neutral-600 hover:text-grip-neutral-800">
            <div className="w-8 h-8 rounded-full bg-grip-blue/10 flex items-center justify-center">
              <User className="h-4 w-4 text-grip-blue" />
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
}
