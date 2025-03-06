
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MealSection } from "./MealSection";
import { DailyNutritionSummary } from "./DailyNutritionSummary";
import { getFoodLogsForDay } from "@/services/food";
import { FoodLog, MealType } from "@/types/food";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function DailyFoodLog() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFoodLogs = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const logs = await getFoodLogsForDay(user.id, date.toISOString());
      setFoodLogs(logs);
    } catch (error) {
      console.error("Error fetching food logs:", error);
      toast.error("Failed to load food log data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodLogs();
  }, [user, date]);

  // Group logs by meal type
  const mealLogs = {
    breakfast: foodLogs.filter(log => log.meal_type === "breakfast"),
    lunch: foodLogs.filter(log => log.meal_type === "lunch"),
    dinner: foodLogs.filter(log => log.meal_type === "dinner"),
    snack: foodLogs.filter(log => log.meal_type === "snack")
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Food Log</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-[200px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <DailyNutritionSummary foodLogs={foodLogs} />

      <div className="space-y-4">
        <MealSection 
          title="Breakfast" 
          mealType="breakfast" 
          foodLogs={mealLogs.breakfast} 
          onUpdate={fetchFoodLogs} 
        />
        <MealSection 
          title="Lunch" 
          mealType="lunch" 
          foodLogs={mealLogs.lunch} 
          onUpdate={fetchFoodLogs} 
        />
        <MealSection 
          title="Dinner" 
          mealType="dinner" 
          foodLogs={mealLogs.dinner} 
          onUpdate={fetchFoodLogs} 
        />
        <MealSection 
          title="Snacks" 
          mealType="snack" 
          foodLogs={mealLogs.snack} 
          onUpdate={fetchFoodLogs} 
        />
      </div>
    </div>
  );
}
