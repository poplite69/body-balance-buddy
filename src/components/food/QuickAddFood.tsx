
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodItem, MealType } from "@/types/food";
import { v4 as uuidv4 } from "uuid";

interface QuickAddFoodProps {
  mealType: MealType;
  onAdd: (foodData: Partial<FoodItem>) => void;
}

export function QuickAddFood({ mealType, onAdd }: QuickAddFoodProps) {
  const [name, setName] = useState("Quick Add");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [alcohol, setAlcohol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new quick-add food item
    const quickAddFood: Partial<FoodItem> = {
      id: uuidv4(),
      name: name || "Quick Add",
      calories: calories ? parseInt(calories) : 0,
      protein_g: protein ? parseFloat(protein) : 0,
      carbs_g: carbs ? parseFloat(carbs) : 0,
      fat_g: fat ? parseFloat(fat) : 0,
      serving_size: 1,
      serving_unit: "serving",
      source: "user",
      data_layer: "user"
    };
    
    onAdd(quickAddFood);
    
    // Reset form
    setName("Quick Add");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setAlcohol("");
  };

  // Calculate total calories based on macros
  const calculateTotalCalories = () => {
    const proteinCal = protein ? parseFloat(protein) * 4 : 0;
    const carbsCal = carbs ? parseFloat(carbs) * 4 : 0;
    const fatCal = fat ? parseFloat(fat) * 9 : 0;
    const alcoholCal = alcohol ? parseFloat(alcohol) * 7 : 0;
    return Math.round(proteinCal + carbsCal + fatCal + alcoholCal);
  };

  // Auto-update calories when macros change
  const autoUpdateCalories = calculateTotalCalories();

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="food-name">Food Name (Optional)</Label>
          <Input
            id="food-name"
            placeholder="Quick Add"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="calories">Calories</Label>
            <div className="relative">
              <Input
                id="calories"
                type="number"
                min="0"
                placeholder={autoUpdateCalories > 0 ? autoUpdateCalories.toString() : "0"}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                kcal
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="protein">Protein</Label>
            <div className="relative">
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                g
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="carbs">Carbs</Label>
            <div className="relative">
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                g
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="fat">Fat</Label>
            <div className="relative">
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                g
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="alcohol">Alcohol (Optional)</Label>
            <div className="relative">
              <Input
                id="alcohol"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={alcohol}
                onChange={(e) => setAlcohol(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                g
              </div>
            </div>
          </div>
        </div>
        
        {autoUpdateCalories > 0 && calories === "" && (
          <div className="text-sm text-muted-foreground">
            Calculated calories: {autoUpdateCalories} kcal
          </div>
        )}
        
        <div className="pt-4">
          <Button type="submit" className="w-full">
            Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </Button>
        </div>
      </form>
    </div>
  );
}
