
import { FoodItemCardProps } from "./types";

export function FoodItemCard({ food, formatMacros, onClick }: FoodItemCardProps) {
  return (
    <div 
      className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted cursor-pointer"
      onClick={onClick}
    >
      <div>
        <p className="font-medium">{food.name}</p>
        {food.brand && (
          <p className="text-xs text-muted-foreground">
            {food.brand}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatMacros(food.protein_g, food.fat_g, food.carbs_g)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">{food.calories} cal</p>
        <p className="text-xs text-muted-foreground">
          {food.serving_size} {food.serving_unit}
        </p>
      </div>
    </div>
  );
}
