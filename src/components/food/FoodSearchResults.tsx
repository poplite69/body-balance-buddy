
import React from "react";
import { FoodItem, MealType } from "@/types/food";
import { AddFoodDialog } from "./AddFoodDialog";

interface FoodSearchResultProps {
  searchResults: FoodItem[];
  onFoodSelected: (food: FoodItem) => void;
  mealType: MealType;
  loading?: boolean;
  error?: string | null;
}

export function FoodSearchResults({
  searchResults,
  onFoodSelected,
  mealType,
  loading = false,
  error = null,
}: FoodSearchResultProps) {
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  // Split results into common and branded categories
  const commonFoods = searchResults.filter(food => 
    food.source === 'system' || food.source === 'api');
  const brandedFoods = searchResults.filter(food => 
    food.source === 'user' && food.brand !== null);

  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food);
    setIsAddDialogOpen(true);
  };

  const formatMacros = (food: FoodItem): string => {
    const cals = food.calories ? `${Math.round(food.calories)} kcal` : '-- kcal';
    const protein = food.protein_g !== null ? `${food.protein_g}P` : '--P';
    const fat = food.fat_g !== null ? `${food.fat_g}F` : '--F';
    const carbs = food.carbs_g !== null ? `${food.carbs_g}C` : '--C';
    const servingInfo = `${food.serving_size} ${food.serving_unit}`;
    
    return `${cals} • ${protein} ${fat} ${carbs} • ${servingInfo}`;
  };

  // Display loading state
  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Loading results...
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="py-4 text-center text-sm text-red-500">
        {error === 'network' 
          ? "Couldn't retrieve foods. Check your connection." 
          : "Something went wrong. Please try again."}
      </div>
    );
  }

  // Empty state
  if (searchResults.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No foods found. Try another search term or add a custom food.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Common foods section */}
      {commonFoods.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">Common</h3>
          <div className="space-y-1">
            {commonFoods.map((food) => (
              <div
                key={food.id}
                className="p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleFoodClick(food)}
              >
                <div className="font-medium">{food.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatMacros(food)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branded foods section */}
      {brandedFoods.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">Branded</h3>
          <div className="space-y-1">
            {brandedFoods.map((food) => (
              <div
                key={food.id}
                className="p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleFoodClick(food)}
              >
                <div className="font-medium">{food.name}</div>
                <div className="text-xs text-muted-foreground">{food.brand}</div>
                <div className="text-sm text-muted-foreground">
                  {formatMacros(food)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AddFoodDialog for selected food */}
      <AddFoodDialog
        food={selectedFood}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          onFoodSelected(selectedFood!);
        }}
        mealType={mealType}
      />
    </div>
  );
}
