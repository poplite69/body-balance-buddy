
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MealSection } from "./MealSection";
import { DailyNutritionSummary } from "./DailyNutritionSummary";
import { getFoodLogsForDay } from "@/services/food";
import { FoodLog, MealType } from "@/types/food";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface DailyFoodLogProps {
  date: Date;
  onDateChange?: (date: Date) => void;
}

export function DailyFoodLog({ date, onDateChange }: DailyFoodLogProps) {
  const { user } = useAuth();
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

  // Calculate total calories for the day
  const totalCalories = foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
  
  // Assuming a default calorie goal of 2400
  const calorieGoal = 2400;
  const calorieProgress = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100);

  return (
    <div className="space-y-6">
      {/* Daily Summary Card */}
      <DailyNutritionSummary foodLogs={foodLogs} calorieGoal={calorieGoal} />
      
      {/* Progress bar for calories */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Daily Progress</span>
          <span>{totalCalories} / {calorieGoal} cal</span>
        </div>
        <Progress value={calorieProgress} className="h-2" />
      </div>
      
      {/* Meal Sections */}
      <div className="space-y-4">
        <MealSection 
          title="Breakfast" 
          mealType="breakfast" 
          foodLogs={mealLogs.breakfast} 
          onUpdate={fetchFoodLogs} 
          suggestedCalories={Math.round(calorieGoal * 0.25)}
        />
        
        <MealSection 
          title="Lunch" 
          mealType="lunch" 
          foodLogs={mealLogs.lunch} 
          onUpdate={fetchFoodLogs} 
          suggestedCalories={Math.round(calorieGoal * 0.35)}
        />
        
        <MealSection 
          title="Dinner" 
          mealType="dinner" 
          foodLogs={mealLogs.dinner} 
          onUpdate={fetchFoodLogs} 
          suggestedCalories={Math.round(calorieGoal * 0.3)}
        />
        
        <MealSection 
          title="Snacks" 
          mealType="snack" 
          foodLogs={mealLogs.snack} 
          onUpdate={fetchFoodLogs} 
          suggestedCalories={Math.round(calorieGoal * 0.1)}
        />
      </div>
    </div>
  );
}
