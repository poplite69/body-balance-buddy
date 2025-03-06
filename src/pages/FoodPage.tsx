
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DailyFoodLog } from "@/components/food/DailyFoodLog";

const FoodPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  
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
  
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Food Tracking</h1>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
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
      </div>
    </div>
  );
};

export default FoodPage;
