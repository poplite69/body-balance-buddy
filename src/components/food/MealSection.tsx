
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MoreVertical } from "lucide-react";
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
    <Card className="overflow-hidden">
      <CardHeader className="py-3 px-4 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {totalCalories > 0 && (
            <span className="text-sm font-medium">{totalCalories} cal</span>
          )}
          {foodLogs.length === 0 && suggestedCalories && (
            <span className="text-xs text-muted-foreground">
              {suggestedCalories} calories suggested
            </span>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={() => setIsAddingFood(!isAddingFood)}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        {isAddingFood && (
          <div className="p-4 border-b border-border bg-muted/20">
            <FoodSearch onFoodSelect={handleFoodSelect} />
          </div>
        )}
        
        {foodLogs.length > 0 ? (
          <div>
            {foodLogs.map((log, index) => (
              <div key={log.id}>
                <div className="flex items-center p-4 hover:bg-muted/10 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium">{log.food_item?.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {log.portion_size} {log.portion_unit}
                      </span>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">{log.calories} cal</span>
                        <span className="text-emerald-500">P: {log.protein_g}g</span>
                        <span className="text-blue-500">C: {log.carbs_g}g</span> 
                        <span className="text-amber-500">F: {log.fat_g}g</span>
                      </div>
                    </div>
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
                {index < foodLogs.length - 1 && <Separator />}
              </div>
            ))}
            
            {/* Meal Summary */}
            <div className="p-3 border-t border-border bg-muted/10">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Total</span>
                <div className="flex items-center gap-2">
                  <span>{totalCalories} cal</span>
                  <span className="text-xs text-emerald-500">P: {totalProtein.toFixed(1)}g</span>
                  <span className="text-xs text-blue-500">C: {totalCarbs.toFixed(1)}g</span>
                  <span className="text-xs text-amber-500">F: {totalFat.toFixed(1)}g</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
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
      </CardContent>
    </Card>
  );
}
