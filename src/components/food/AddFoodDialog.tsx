
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FoodItem, MealType } from "@/types/food";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { logFood } from "@/services/food";
import { useAuth } from "@/context/AuthContext";
import { PortionSelect } from "./PortionSelect";
import { Heart } from "lucide-react";

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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFavorite}
            className={isFavorite ? "text-red-500" : "text-muted-foreground"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Brand if available */}
          {food.brand && (
            <p className="text-sm text-muted-foreground">{food.brand}</p>
          )}
          
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

          {/* Enhanced nutrition display */}
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
