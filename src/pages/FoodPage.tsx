
import { useState, useEffect, useRef } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon, Search as SearchIcon, X, Mic, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DailyFoodLog } from "@/components/food/DailyFoodLog";
import { searchFoodItems } from "@/services/food";
import { FoodItem, MealType } from "@/types/food";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { logFood } from "@/services/food";
import { toast } from "sonner";
import { AddFoodDialog } from "@/components/food/AddFoodDialog";
import { FoodLogEntryContainer } from "@/components/food/FoodLogEntryContainer";

const FoodPage = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [showFoodEntryContainer, setShowFoodEntryContainer] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const goToPreviousDay = () => {
    setDate(prev => subDays(prev, 1));
  };
  
  const goToNextDay = () => {
    setDate(prev => addDays(prev, 1));
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Perform search when text changes
  useEffect(() => {
    const handleSearch = async () => {
      if (searchText.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchFoodItems(searchText);
          setSearchResults(results);
        } catch (error) {
          console.error("Food search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  // Function to handle food selection and add to log
  const handleFoodSelect = async (food: FoodItem, mealType: MealType) => {
    if (!user) return;
    
    setSelectedFood(food);
    setSelectedMealType(mealType);
  };

  // Clear search
  const clearSearch = () => {
    setSearchText("");
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Format macros in a compact format
  const formatMacros = (protein: number | null, fat: number | null, carbs: number | null) => {
    const p = protein ? Math.round(protein) : 0;
    const f = fat ? Math.round(fat) : 0;
    const c = carbs ? Math.round(carbs) : 0;
    return `${p}P ${f}F ${c}C`;
  };

  // Group search results by category
  const categorizedResults = {
    common: searchResults.filter(item => !item.brand),
    branded: searchResults.filter(item => !!item.brand)
  };

  // Handle food selected from the entry container
  const handleFoodSelectedFromContainer = (food: FoodItem) => {
    setSelectedFood(food);
    setShowFoodEntryContainer(false);
  };

  // Handle quick add from the entry container
  const handleQuickAdd = (foodData: Partial<FoodItem>) => {
    // Handle the quick add functionality
    console.log("Quick add:", foodData);
    setShowFoodEntryContainer(false);
    // Further processing can be done here
  };
  
  return (
    <div className="container p-4 pt-6 pb-28 space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-2xl font-bold mb-4">Food Tracking</h1>
      </header>
      
      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToPreviousDay}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "px-6 py-6 text-center font-medium text-lg",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {format(date, "EEE, d MMM")}
              {isToday(date) && <span className="ml-2 text-sm text-muted-foreground">(Today)</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToNextDay}
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
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
        onClose={() => setShowFoodEntryContainer(false)}
        mealType={selectedMealType}
        initialTab="search"
        onFoodSelected={handleFoodSelectedFromContainer}
        onQuickAdd={handleQuickAdd}
      />
      
      {/* Bottom Search Bar - Fixed at bottom above nav */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-background/80 backdrop-blur-sm border-t border-border">
        <div className="flex flex-col max-w-md mx-auto">
          <div className="relative">
            <div 
              className="flex items-center bg-gray-800/70 rounded-full px-4 text-gray-100 cursor-pointer"
              onClick={() => setShowFoodEntryContainer(true)}
            >
              <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                readOnly
                placeholder="Search for a food"
                className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer text-white py-5"
                onClick={() => setShowFoodEntryContainer(true)}
              />
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                  e.stopPropagation();
                  setShowFoodEntryContainer(true);
                  // Future implementation will set initial tab to "barcode"
                }}>
                  <Barcode className="h-5 w-5 text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                  e.stopPropagation();
                  setShowFoodEntryContainer(true);
                  // Future implementation will set initial tab to "ai-describe"
                }}>
                  <Mic className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
