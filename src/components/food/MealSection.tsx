import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { FoodLog, FoodItem, MealType } from "@/types/food";
import { deleteFoodLog } from "@/services/food";
import { toast } from "sonner";
import { FoodSearch } from "./FoodSearch";
import { AddFoodDialog } from "./AddFoodDialog";
import { Separator } from "@/components/ui/separator";

interface MealSectionProps {
  title: string;
  mealType: MealType;
  foodLogs: FoodLog[];
  onUpdate: () => void;
  suggestedCalories?: number;
}

export function MealSection({ 
  title, 
  mealType, 
  foodLogs, 
  onUpdate,
  suggestedCalories
}: MealSectionProps) {
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };
  
  const handleEdit = async (logId: string) => {
    // For now, we'll keep the deletion functionality but change the icon
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
  
  // Round values
  const roundedProtein = Math.round(totalProtein);
  const roundedCarbs = Math.round(totalCarbs);
  const roundedFat = Math.round(totalFat);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {foodLogs.length > 0 && (
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>{totalCalories} cal</span>
              <span className="text-emerald-500">{roundedProtein}P</span>
              <span className="text-blue-500">{roundedCarbs}C</span>
              <span className="text-amber-500">{roundedFat}F</span>
            </div>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={() => setIsAddingFood(!isAddingFood)}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      {isAddingFood && (
        <div className="mb-3 border rounded-lg p-4 bg-muted/20">
          <FoodSearch onFoodSelect={handleFoodSelect} />
        </div>
      )}
      
      {foodLogs.length > 0 ? (
        <div className="space-y-2 mb-4">
          {foodLogs.map((log) => (
            <Card key={log.id} className="overflow-hidden">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{log.food_item?.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {log.portion_size} {log.portion_unit}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{log.calories} cal</span>
                    <span className="text-emerald-500">{Math.round(log.protein_g || 0)}P</span>
                    <span className="text-blue-500">{Math.round(log.carbs_g || 0)}C</span>
                    <span className="text-amber-500">{Math.round(log.fat_g || 0)}F</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleEdit(log.id)}
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-6 mb-4 text-center text-muted-foreground border rounded-lg bg-muted/10">
          <p>No foods logged for {title.toLowerCase()} yet</p>
          <Button 
            className="mt-2" 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingFood(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add {title}
          </Button>
        </div>
      )}
      
      <AddFoodDialog 
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
        onSuccess={onUpdate}
        mealType={mealType}
      />
    </div>
  );
}
