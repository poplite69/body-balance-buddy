
import { FoodItem } from "@/types/food";
import { Star } from "lucide-react";

interface FavoritesTabProps {
  favoriteFoods: FoodItem[];
  onFoodSelect: (food: FoodItem) => void;
  formatMacros: (protein: number | null, fat: number | null, carbs: number | null) => string;
}

export function FavoritesTab({ favoriteFoods, onFoodSelect, formatMacros }: FavoritesTabProps) {
  if (favoriteFoods.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        You don't have any favorite foods yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {favoriteFoods.map((food) => (
        <div 
          key={food.id}
          className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted cursor-pointer"
          onClick={() => onFoodSelect(food)}
        >
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
            <div>
              <p className="font-medium">{food.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatMacros(food.protein_g, food.fat_g, food.carbs_g)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{food.calories} cal</p>
            <p className="text-xs text-muted-foreground">
              {food.serving_size} {food.serving_unit}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
