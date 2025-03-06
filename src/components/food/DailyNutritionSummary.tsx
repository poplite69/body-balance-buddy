
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
  
  // Prepare data for pie chart
  const macroData = [
    { name: 'Protein', value: proteinCalories, color: '#10b981' },
    { name: 'Carbs', value: carbsCalories, color: '#3b82f6' },
    { name: 'Fat', value: fatCalories, color: '#f59e0b' }
  ].filter(item => item.value > 0);
  
  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
          {/* Calories Summary */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">BUDGET</h3>
            <p className="text-2xl font-bold text-primary">{calorieGoal}</p>
          </div>
          
          <div className="col-span-2 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">FOOD</h3>
            <p className="text-2xl font-bold">{totalCalories}</p>
          </div>
          
          <div className="col-span-2 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">REMAINING</h3>
            <p className={`text-2xl font-bold ${remainingCalories >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {remainingCalories >= 0 ? remainingCalories : remainingCalories}
            </p>
          </div>
          
          {/* Macros Summary */}
          <div className="col-span-2 md:col-span-3 grid grid-cols-3 gap-2 mt-4 md:mt-0">
            <div className="flex flex-col items-center">
              <div className="text-md font-medium">{totalProtein.toFixed(1)}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
              <div className="text-sm">{proteinPercentage}%</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-md font-medium">{totalCarbs.toFixed(1)}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
              <div className="text-sm">{carbsPercentage}%</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-md font-medium">{totalFat.toFixed(1)}g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
              <div className="text-sm">{fatPercentage}%</div>
            </div>
          </div>
          
          {/* Pie Chart */}
          {totalMacroCalories > 0 && (
            <div className="col-span-2 md:col-span-3 flex justify-center">
              <div className="w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
