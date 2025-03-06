
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FoodLog } from "@/types/food";

interface NutritionSummaryProps {
  foodLogs: FoodLog[];
  calorieGoal?: number;
}

export function DailyNutritionSummary({ foodLogs, calorieGoal = 2400 }: NutritionSummaryProps) {
  // Calculate nutritional totals
  const totalCalories = foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const totalProtein = foodLogs.reduce((sum, log) => sum + (log.protein_g || 0), 0);
  const totalCarbs = foodLogs.reduce((sum, log) => sum + (log.carbs_g || 0), 0);
  const totalFat = foodLogs.reduce((sum, log) => sum + (log.fat_g || 0), 0);
  
  // Calculate macronutrient percentages
  const proteinCalories = totalProtein * 4;
  const carbsCalories = totalCarbs * 4;
  const fatCalories = totalFat * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;
  
  // Calculate remaining calories
  const remainingCalories = calorieGoal - totalCalories;
  
  // Round values to whole numbers
  const roundedProtein = Math.round(totalProtein);
  const roundedCarbs = Math.round(totalCarbs);
  const roundedFat = Math.round(totalFat);
  
  // Calculate progress percentage (capped at 100%)
  const calorieProgress = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100);
  
  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Daily Budget */}
          <div className="flex justify-between">            
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">BUDGET</span>
              <span className="text-xl font-bold text-primary">{calorieGoal}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">FOOD</span>
              <span className="text-xl font-bold">{totalCalories}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">REMAINING</span>
              <span className={`text-xl font-bold ${remainingCalories >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {remainingCalories}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Daily Progress</span>
              <span>{totalCalories} / {calorieGoal} cal</span>
            </div>
            <Progress value={calorieProgress} className="h-2" />
          </div>
          
          {/* Macros Summary (compact format) */}
          <div className="flex justify-start gap-4 pt-1">
            <span className="text-sm">{roundedProtein}P</span>
            <span className="text-sm">{roundedCarbs}C</span>
            <span className="text-sm">{roundedFat}F</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
