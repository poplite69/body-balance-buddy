
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
  
  // Calculate macronutrient percentages by calories
  const proteinCalories = totalProtein * 4;
  const carbsCalories = totalCarbs * 4;
  const fatCalories = totalFat * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;
  
  // Calculate percentages relative to total calories consumed (not goal)
  const proteinPercentage = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
  const carbsPercentage = totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0;
  const fatPercentage = totalMacroCalories > 0 ? (fatCalories / totalMacroCalories) * 100 : 0;
  
  // Calculate remaining calories
  const remainingCalories = calorieGoal - totalCalories;
  
  // Round values to whole numbers
  const roundedProtein = Math.round(totalProtein);
  const roundedCarbs = Math.round(totalCarbs);
  const roundedFat = Math.round(totalFat);
  
  // Calculate progress percentage (capped at 100%)
  const calorieProgress = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100);
  
  // Progress bar segments - scale based on actual calories consumed, not total bar width
  const progressSegments = [
    { value: proteinPercentage * (calorieProgress / 100), color: '#10b981' }, // emerald-500 for protein
    { value: carbsPercentage * (calorieProgress / 100), color: '#3b82f6' },   // blue-500 for carbs
    { value: fatPercentage * (calorieProgress / 100), color: '#f59e0b' }      // amber-500 for fat
  ];
  
  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Daily Progress</span>
            </div>
            <Progress value={calorieProgress} segments={progressSegments} className="h-2" />
          </div>
          
          {/* Macros Summary */}
          <div className="flex justify-between pt-1">
            {/* Individual macros with colors (left aligned) */}
            <div className="flex gap-3">
              <span className="text-sm text-emerald-500">{roundedProtein}P</span>
              <span className="text-sm text-blue-500">{roundedCarbs}C</span>
              <span className="text-sm text-amber-500">{roundedFat}F</span>
            </div>
            
            {/* Calories (right aligned) */}
            <div className="text-sm text-blue-500">{totalCalories} / {calorieGoal} C</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
