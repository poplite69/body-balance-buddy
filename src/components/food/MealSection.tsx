
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FoodLog, FoodItem, MealType } from "@/types/food";
import { deleteFoodLog } from "@/services/foodService";
import { toast } from "sonner";
import { FoodSearch } from "./FoodSearch";
import { AddFoodDialog } from "./AddFoodDialog";

interface MealSectionProps {
  title: string;
  mealType: MealType;
  foodLogs: FoodLog[];
  onUpdate: () => void;
}

export function MealSection({ title, mealType, foodLogs, onUpdate }: MealSectionProps) {
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };
  
  const handleDelete = async (logId: string) => {
    try {
      await deleteFoodLog(logId);
      toast.success("Food removed from log");
      onUpdate();
    } catch (error) {
      console.error("Error deleting food log:", error);
      toast.error("Failed to remove food. Please try again.");
    }
  };
  
  // Calculate totals for the meal
  const totalCalories = foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const totalProtein = foodLogs.reduce((sum, log) => sum + (log.protein_g || 0), 0);
  const totalCarbs = foodLogs.reduce((sum, log) => sum + (log.carbs_g || 0), 0);
  const totalFat = foodLogs.reduce((sum, log) => sum + (log.fat_g || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setIsAddingFood(!isAddingFood)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Food
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingFood && (
          <div className="mb-4">
            <FoodSearch onFoodSelect={handleFoodSelect} />
          </div>
        )}
        
        {foodLogs.length > 0 ? (
          <div className="space-y-2">
            {foodLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-center p-2 border-b">
                <div>
                  <p className="font-medium">{log.food_item?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.portion_size} {log.portion_unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">{log.calories} cal</p>
                    <p className="text-xs text-muted-foreground">
                      P: {log.protein_g}g • C: {log.carbs_g}g • F: {log.fat_g}g
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleDelete(log.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-2 border-t mt-3 font-medium">
              <div>Total</div>
              <div>
                {totalCalories} cal • P: {totalProtein.toFixed(1)}g • C: {totalCarbs.toFixed(1)}g • F: {totalFat.toFixed(1)}g
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No foods logged for this meal yet
          </div>
        )}
        
        <AddFoodDialog 
          food={selectedFood}
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          onSuccess={onUpdate}
          mealType={mealType}
        />
      </CardContent>
    </Card>
  );
}
