
import { useState, useEffect, useRef } from "react";
import { FoodItem, MealType } from "@/types/food";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { DailyFoodLog } from "@/components/food/DailyFoodLog";
import { AddFoodDialog } from "@/components/food/AddFoodDialog";
import { FoodLogEntryContainer } from "@/components/food/FoodLogEntryContainer";
import { AppLayout } from "@/components/layout/AppLayout";
import { DateNavigation } from "@/components/food/DateNavigation";
import { FoodSearchBar } from "@/components/food/FoodSearchBar";

const FoodPage = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [showFoodEntryContainer, setShowFoodEntryContainer] = useState(false);
  const [initialEntryTab, setInitialEntryTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Function to handle food selection
  const handleFoodSelect = (food: FoodItem) => {
    if (!user) return;
    
    setSelectedFood(food);
    setShowFoodEntryContainer(false);
    setSearchQuery("");
  };

  // Function to handle quick add
  const handleQuickAdd = (foodData: Partial<FoodItem>) => {
    console.log("Quick add:", foodData);
    setShowFoodEntryContainer(false);
    setSearchQuery("");
    // Further processing can be done here
    toast.success("Food added successfully");
  };

  // Function to open entry container with a specific tab
  const openEntryContainer = (tab: string = "search") => {
    setInitialEntryTab(tab);
    setShowFoodEntryContainer(true);
    
    // Focus the search input if opening the search tab
    if (tab === "search" && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If the query is not empty and the entry container is not open, open it
    if (query.length > 0 && !showFoodEntryContainer) {
      openEntryContainer("search");
    }
  };
  
  return (
    <AppLayout>
      <div className="container p-4 pt-6 pb-28 space-y-6 max-w-md mx-auto">
        <header>
          <h1 className="text-2xl font-bold mb-4">Food Tracking</h1>
        </header>
        
        {/* Date Navigation */}
        <DateNavigation date={date} onDateChange={setDate} />
        
        {/* Food Log with Daily Summary */}
        <DailyFoodLog date={date} onDateChange={setDate} />
        
        {/* Food Detail Dialog */}
        <AddFoodDialog 
          food={selectedFood}
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          onSuccess={() => setSelectedFood(null)}
          mealType={selectedMealType}
        />
        
        {/* Food Entry Container */}
        <FoodLogEntryContainer
          isOpen={showFoodEntryContainer}
          onClose={() => {
            setShowFoodEntryContainer(false);
            setSearchQuery("");
          }}
          mealType={selectedMealType}
          initialTab={initialEntryTab}
          onFoodSelected={handleFoodSelect}
          onQuickAdd={handleQuickAdd}
          searchQuery={searchQuery}
        />
        
        {/* Bottom Search Bar */}
        <FoodSearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onOpenEntryContainer={openEntryContainer}
          inputRef={searchInputRef}
        />
      </div>
    </AppLayout>
  );
};

export default FoodPage;
