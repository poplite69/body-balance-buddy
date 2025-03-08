
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FoodItem, MealType } from "@/types/food";
import { toast } from "sonner";
import { logFood } from "@/services/food";
import { useAuth } from "@/context/AuthContext";
import { PortionSelect } from "./PortionSelect";
import { FoodNutritionCard } from "./dialog/FoodNutritionCard";
import { MealTypeTabs } from "./dialog/MealTypeTabs";
import { FoodFavoriteButton } from "./dialog/FoodFavoriteButton";

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
  const [isFavorite, setIsFavorite] = useState(false);

  // Reset state when food changes
  useEffect(() => {
    if (food) {
      setPortion(food.serving_size);
      setUnit(food.serving_unit);
      
      // Check if this is a favorite food (placeholder)
      setIsFavorite(false);
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

  const toggleFavorite = () => {
    // This would actually save to the database in a real implementation
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  // Calculate macronutrient percentages
  const calculateMacroPercentages = () => {
    if (!food) return { protein: 0, carbs: 0, fat: 0 };
    
    const proteinCal = calculateNutrition(food.protein_g) * 4;
    const carbsCal = calculateNutrition(food.carbs_g) * 4;
    const fatCal = calculateNutrition(food.fat_g) * 9;
    const totalMacroCal = proteinCal + carbsCal + fatCal;
    
    if (totalMacroCal === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: Math.round((proteinCal / totalMacroCal) * 100),
      carbs: Math.round((carbsCal / totalMacroCal) * 100),
      fat: Math.round((fatCal / totalMacroCal) * 100)
    };
  };

  if (!food) return null;

  const macroPercentages = calculateMacroPercentages();
  const calculatedCalories = calculateNutrition(food.calories);
  const calculatedProtein = calculateNutrition(food.protein_g);
  const calculatedCarbs = calculateNutrition(food.carbs_g);
  const calculatedFat = calculateNutrition(food.fat_g);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{food.name}</DialogTitle>
          <FoodFavoriteButton 
            isFavorite={isFavorite} 
            onToggleFavorite={toggleFavorite} 
          />
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Brand if available */}
          {food.brand && (
            <p className="text-sm text-muted-foreground">{food.brand}</p>
          )}
          
          <div className="space-y-2">
            <MealTypeTabs 
              selectedMealType={selectedMealType} 
              onMealTypeChange={setSelectedMealType} 
            />
          </div>

          {/* Enhanced nutrition display */}
          <FoodNutritionCard
            food={food}
            calculatedCalories={calculatedCalories}
            calculatedProtein={calculatedProtein}
            calculatedCarbs={calculatedCarbs}
            calculatedFat={calculatedFat}
            macroPercentages={macroPercentages}
            calculateNutrition={calculateNutrition}
          />

          <PortionSelect 
            food={food} 
            defaultPortion={portion} 
            defaultUnit={unit || food.serving_unit} 
            onPortionChange={handlePortionChange} 
          />
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
