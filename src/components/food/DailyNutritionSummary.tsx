
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FoodLog } from "@/types/food";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

interface NutritionSummaryProps {
  foodLogs: FoodLog[];
}

export function DailyNutritionSummary({ foodLogs }: NutritionSummaryProps) {
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
  
  // Prepare data for pie chart
  const macroData = [
    { name: 'Protein', value: proteinCalories, color: '#10b981' },
    { name: 'Carbs', value: carbsCalories, color: '#3b82f6' },
    { name: 'Fat', value: fatCalories, color: '#f59e0b' }
  ].filter(item => item.value > 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-3xl font-bold text-center">
              {totalCalories}
              <span className="text-base ml-1 font-normal">cal</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-4">
              <div>
                <div className="text-xl font-medium">{totalProtein.toFixed(1)}g</div>
                <div className="text-xs text-muted-foreground">Protein</div>
                <div className="text-sm">{proteinPercentage}%</div>
              </div>
              <div>
                <div className="text-xl font-medium">{totalCarbs.toFixed(1)}g</div>
                <div className="text-xs text-muted-foreground">Carbs</div>
                <div className="text-sm">{carbsPercentage}%</div>
              </div>
              <div>
                <div className="text-xl font-medium">{totalFat.toFixed(1)}g</div>
                <div className="text-xs text-muted-foreground">Fat</div>
                <div className="text-sm">{fatPercentage}%</div>
              </div>
            </div>
          </div>
          {totalMacroCalories > 0 && (
            <div className="w-32 h-32">
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
                    <Label
                      value={`${totalCalories}`}
                      position="center"
                      className="text-xs"
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
