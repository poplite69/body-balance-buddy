import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon, ScanBarcode, Mic, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DailyFoodLog } from "@/components/food/DailyFoodLog";
import { FoodLogEntryContainer } from "@/components/food/FoodLogEntryContainer";

const FoodPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [searchText, setSearchText] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
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

  const handleSearchIconClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleScancodeClick = () => {
    // This is for Phase 3, just show a toast or open barcode tab
    setIsSearchModalOpen(true);
  };

  const handleMicClick = () => {
    // This is for Phase 3, just show a toast or open AI describe tab
    setIsSearchModalOpen(true);
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

      {/* Search Modal */}
      <FoodLogEntryContainer
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        initialTab="search"
        mealType="breakfast"
        onFoodSelected={() => setIsSearchModalOpen(false)}
        onQuickAdd={() => setIsSearchModalOpen(false)}
      />
      
      {/* Bottom Search Bar - Fixed at bottom above nav */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-background/80 backdrop-blur-sm border-t border-border">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <div 
            className="flex items-center justify-between bg-gray-800/70 rounded-full px-4 py-2 w-full cursor-pointer"
            onClick={handleSearchIconClick}
          >
            <div className="flex items-center">
              <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-400">Search for a food</span>
            </div>
            <div className="flex gap-3">
              <ScanBarcode 
                className="h-5 w-5 text-gray-400" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleScancodeClick();
                }}
              />
              <Mic 
                className="h-5 w-5 text-gray-400" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMicClick();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
