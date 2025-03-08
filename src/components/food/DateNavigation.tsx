
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateNavigationProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DateNavigation = ({ date, onDateChange }: DateNavigationProps) => {
  const goToPreviousDay = () => {
    onDateChange(subDays(date, 1));
  };
  
  const goToNextDay = () => {
    onDateChange(addDays(date, 1));
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
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
            onSelect={(date) => date && onDateChange(date)}
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
  );
};
