
import { FoodItem } from "@/types/food";

interface FoodNutritionCardProps {
  food: FoodItem;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFat: number;
  macroPercentages: {
    protein: number;
    carbs: number;
    fat: number;
  };
  calculateNutrition: (field: number | null) => number;
}

export function FoodNutritionCard({
  food,
  calculatedCalories,
  calculatedProtein,
  calculatedCarbs,
  calculatedFat,
  macroPercentages,
  calculateNutrition,
}: FoodNutritionCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium mb-3">Nutrition Facts</h3>
      
      <div className="space-y-3">
        {/* Calories - highlighted */}
        <div className="border-b pb-2">
          <div className="text-lg font-bold">{Math.round(calculatedCalories)} calories</div>
        </div>
        
        {/* Macronutrients with progress bars */}
        <div className="space-y-2">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Protein</span>
              <span>{calculatedProtein}g <span className="text-muted-foreground">({macroPercentages.protein}%)</span></span>
            </div>
            <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${macroPercentages.protein}%` }}
              ></div>
            </div>
          </div>
          
          {/* Carbs */}
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Carbs</span>
              <span>{calculatedCarbs}g <span className="text-muted-foreground">({macroPercentages.carbs}%)</span></span>
            </div>
            <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${macroPercentages.carbs}%` }}
              ></div>
            </div>
          </div>
          
          {/* Fat */}
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Fat</span>
              <span>{calculatedFat}g <span className="text-muted-foreground">({macroPercentages.fat}%)</span></span>
            </div>
            <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: `${macroPercentages.fat}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t">
        <h4 className="text-sm font-medium mb-2">Additional Nutrients</h4>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          {food.fiber_g !== null && (
            <>
              <div>Fiber:</div>
              <div className="text-right">{calculateNutrition(food.fiber_g)} g</div>
            </>
          )}
          
          {food.sugar_g !== null && (
            <>
              <div>Sugar:</div>
              <div className="text-right">{calculateNutrition(food.sugar_g)} g</div>
            </>
          )}
          
          {food.sodium_mg !== null && (
            <>
              <div>Sodium:</div>
              <div className="text-right">{calculateNutrition(food.sodium_mg)} mg</div>
            </>
          )}
          
          {food.cholesterol_mg !== null && (
            <>
              <div>Cholesterol:</div>
              <div className="text-right">{calculateNutrition(food.cholesterol_mg)} mg</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
