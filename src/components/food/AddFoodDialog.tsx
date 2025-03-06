
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FoodItem, MealType } from "@/types/food";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { logFood } from "@/services/foodService";
import { useAuth } from "@/context/AuthContext";
import { PortionSelect } from "./PortionSelect";

interface AddFoodDialogProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mealType?: MealType;
}

export function AddFoodDialog({ food, isOpen, onClose, onSuccess, mealType = "breakfast" }: AddFoodDialogProps) {
  const { user } = useAuth();
  const [selectedMealType, setSelectedMealType] = useState<MealType>(mealType);
  const [portion, setPortion] = useState<number>(1);
  const [unit, setUnit] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when food changes
  useEffect(() => {
    if (food) {
      setPortion(food.serving_size);
      setUnit(food.serving_unit);
    }
  }, [food]);

  // Calculate nutrition based on portion
  const calculateNutrition = (field: number | null): number => {
    if (!food || field === null) return 0;
    const multiplier = portion / food.serving_size;
    return parseFloat((field * multiplier).toFixed(2));
  };

  const handlePortionChange = (amount: number, portionUnit: string) => {
    setPortion(amount);
    setUnit(portionUnit);
  };

  const handleSubmit = async () => {
    if (!food || !user) return;
    
    setIsSubmitting(true);
    try {
      await logFood(
        user.id,
        food.id,
        selectedMealType,
        portion,
        unit || food.serving_unit
      );
      toast.success(`Added ${food.name} to ${selectedMealType}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error logging food:", error);
      toast.error("Failed to add food. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!food) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add {food.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="space-y-2">
            <Tabs value={selectedMealType} onValueChange={(value) => setSelectedMealType(value as MealType)} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="dinner">Dinner</TabsTrigger>
                <TabsTrigger value="snack">Snack</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <PortionSelect 
            food={food} 
            defaultPortion={portion} 
            defaultUnit={unit || food.serving_unit} 
            onPortionChange={handlePortionChange} 
          />

          <div className="rounded-lg border p-3">
            <h3 className="font-medium">Nutrition</h3>
            <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
              <div>Calories:</div>
              <div className="text-right">{calculateNutrition(food.calories)} cal</div>
              
              <div>Protein:</div>
              <div className="text-right">{calculateNutrition(food.protein_g)} g</div>
              
              <div>Carbs:</div>
              <div className="text-right">{calculateNutrition(food.carbs_g)} g</div>
              
              <div>Fat:</div>
              <div className="text-right">{calculateNutrition(food.fat_g)} g</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add to Log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
