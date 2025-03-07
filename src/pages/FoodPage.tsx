
import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DailyFoodLog } from "@/components/food/DailyFoodLog";
import { ExpandableSearchInput } from "@/components/food/ExpandableSearchInput";
import { FoodSearchResults } from "@/components/food/FoodSearchResults";
import { searchFoodItems } from "@/services/food/search";
import { FoodItem } from "@/types/food";
import { useDebounce } from "@/hooks/useDebounce";

const FoodPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeLogRefresh, setActiveLogRefresh] = useState(0);
  
  // Use debounce to avoid too many search requests
  const debouncedSearch = useDebounce((text: string) => {
    setDebouncedSearchText(text);
  }, 200);
  
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

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setDebouncedSearchText("");
    setSearchResults([]);
  };

  const handleBarcodeClick = () => {
    // For future barcode scanner implementation
    console.log("Barcode scanner clicked");
  };

  const handleFoodSelected = (food: FoodItem) => {
    // Refresh the food log to show the newly added food
    setActiveLogRefresh(prev => prev + 1);
    
    // Clear search after selection
    handleClearSearch();
  };

  // Fetch search results whenever debouncedSearchText changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchText) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setSearchError(null);

      try {
        const results = await searchFoodItems(debouncedSearchText);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching for foods:", error);
        setSearchError("network");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchText]);
  
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
      <DailyFoodLog 
        date={date} 
        onDateChange={setDate} 
        key={`log-${date.toISOString()}-${activeLogRefresh}`}
      />
      
      {/* Search Results (only shown when search text is entered) */}
      {debouncedSearchText && (
        <div className="mt-3 mb-1 bg-background/80 backdrop-blur-sm rounded-lg overflow-hidden border border-border">
          <FoodSearchResults 
            searchResults={searchResults}
            onFoodSelected={handleFoodSelected}
            mealType="breakfast" // Default meal type, can be changed when selecting from meal section
            loading={isLoading}
            error={searchError}
          />
        </div>
      )}
      
      {/* Bottom Search Bar - Fixed at bottom above nav */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-background/80 backdrop-blur-sm border-t border-border">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <ExpandableSearchInput
            value={searchText}
            onChange={handleSearchChange}
            onScanBarcode={handleBarcodeClick}
            onClear={handleClearSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
