
import { Card, CardContent } from "@/components/ui/card";
import { FoodLog } from "@/types/food";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
  
  const proteinPercentage = totalMacroCalories > 0 ? Math.round((proteinCalories / totalMacroCalories) * 100) : 0;
  const carbsPercentage = totalMacroCalories > 0 ? Math.round((carbsCalories / totalMacroCalories) * 100) : 0;
  const fatPercentage = totalMacroCalories > 0 ? Math.round((fatCalories / totalMacroCalories) * 100) : 0;
  
  // Calculate remaining calories
  const remainingCalories = calorieGoal - totalCalories;
  
  // Round values to whole numbers
  const roundedProtein = Math.round(totalProtein);
  const roundedCarbs = Math.round(totalCarbs);
  const roundedFat = Math.round(totalFat);
  
  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          {/* Budget & Calories */}
          <div className="flex gap-8">
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
          
          {/* Macros Summary */}
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">P</span>
              <span className="text-md font-medium">{roundedProtein}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">C</span>
              <span className="text-md font-medium">{roundedCarbs}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">F</span>
              <span className="text-md font-medium">{roundedFat}g</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
