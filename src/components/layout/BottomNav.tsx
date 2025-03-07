
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Dumbbell, User, Apple } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { 
      icon: Home, 
      path: '/', 
      label: 'Home'
    },
    { 
      icon: Apple, 
      path: '/food', 
      label: 'Diet'
    },
    { 
      icon: Dumbbell, 
      path: '/workout', 
      label: 'Workout'
    },
    { 
      icon: User, 
      path: '/auth', 
      label: 'Profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border h-16 mobile-nav-height md:hidden">
      <nav className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default BottomNav;
