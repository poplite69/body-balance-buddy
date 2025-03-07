
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, User, Apple, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FoodLogEntryContainer } from '../food/FoodLogEntryContainer';
import { FoodItem } from '@/types/food';
import { logFood } from '@/services/food';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
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
      icon: Plus,
      path: '#quick-add',
      label: 'Add',
      action: () => {
        if (location.pathname === '/food') {
          setIsQuickAddOpen(true);
        } else {
          navigate('/food');
          setTimeout(() => setIsQuickAddOpen(true), 300);
        }
      },
      className: 'bg-primary text-primary-foreground rounded-full -mt-2 h-9 w-9 flex items-center justify-center shadow-md'
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

  const handleFoodSelected = async (food: FoodItem) => {
    if (!user) return;
    
    try {
      // Log the food to the "snack" meal type by default from quick add
      await logFood(
        user.id,
        food.id,
        'snack',
        food.serving_size,
        food.serving_unit
      );
      
      toast.success(`Added ${food.name} to snack`);
      setIsQuickAddOpen(false);
      
      // If already on food page, trigger a refresh (via state change)
      if (location.pathname === '/food') {
        // This needs a callback to refresh the food page data
        // A potential implementation would be to use context or query invalidation
        // For now, we'll just show a message to refresh
        toast.info("Refresh the page to see your changes");
      } else {
        // Navigate to food page
        navigate('/food');
      }
    } catch (error) {
      console.error("Error logging food:", error);
      toast.error("Failed to add food. Please try again.");
    }
  };

  const handleQuickAdd = async (foodData: Partial<FoodItem>) => {
    if (!user) return;
    
    try {
      // Create a simplified food log directly
      await logFood(
        user.id,
        foodData.id as string,
        'snack',
        1,
        "serving",
        {
          calories: foodData.calories || 0,
          protein_g: foodData.protein_g || 0,
          carbs_g: foodData.carbs_g || 0,
          fat_g: foodData.fat_g || 0
        }
      );
      
      toast.success(`Added ${foodData.name || "food"} to snack`);
      setIsQuickAddOpen(false);
      
      // If already on food page, trigger a refresh
      if (location.pathname === '/food') {
        toast.info("Refresh the page to see your changes");
      } else {
        navigate('/food');
      }
    } catch (error) {
      console.error("Error adding quick food:", error);
      toast.error("Failed to add food. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border h-16 mobile-nav-height md:hidden">
        <nav className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.action) {
              return (
                <button
                  key={item.path}
                  onClick={item.action}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full transition-colors",
                    item.className,
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            }
            
            return (
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
            );
          })}
        </nav>
      </div>
      
      {/* Quick Add Modal */}
      <FoodLogEntryContainer
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        mealType="snack"
        onFoodSelected={handleFoodSelected}
        onQuickAdd={handleQuickAdd}
      />
    </>
  );
}

export default BottomNav;
