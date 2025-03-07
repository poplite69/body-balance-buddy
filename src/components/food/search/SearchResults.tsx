
import { ChevronDown, ChevronUp, ArrowDownUp } from "lucide-react";
import { FoodItem } from "@/types/food";
import { CategoryState, SearchResultsProps } from "./types";
import { FoodItemCard } from "./FoodItemCard";

export function SearchResults({ 
  searchResults, 
  isSearching, 
  expandedCategories, 
  toggleCategory, 
  onFoodSelect,
  formatMacros
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Searching...
      </div>
    );
  }

  if (searchResults.length === 0) {
    return null;
  }

  // Group search results by category (common vs branded)
  const categorizedResults = {
    common: searchResults.filter(item => !item.brand),
    branded: searchResults.filter(item => !!item.brand)
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          {searchResults.length} results
        </p>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <ArrowDownUp className="h-3 w-3" /> 
          Sorted by popularity
        </div>
      </div>
      
      {/* Common Foods Category */}
      {categorizedResults.common.length > 0 && (
        <div className="mb-4">
          <div 
            className="flex items-center justify-between py-2 px-1 cursor-pointer"
            onClick={() => toggleCategory('common')}
          >
            <h3 className="font-medium">Common Foods</h3>
            {expandedCategories.common ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </div>
          
          {expandedCategories.common && (
            <div className="space-y-2">
              {categorizedResults.common.map((food) => (
                <FoodItemCard 
                  key={food.id}
                  food={food}
                  formatMacros={formatMacros}
                  onClick={() => onFoodSelect(food)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Branded Foods Category */}
      {categorizedResults.branded.length > 0 && (
        <div>
          <div 
            className="flex items-center justify-between py-2 px-1 cursor-pointer"
            onClick={() => toggleCategory('branded')}
          >
            <h3 className="font-medium">Branded Foods</h3>
            {expandedCategories.branded ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </div>
          
          {expandedCategories.branded && (
            <div className="space-y-2">
              {categorizedResults.branded.map((food) => (
                <FoodItemCard 
                  key={food.id}
                  food={food}
                  formatMacros={formatMacros}
                  onClick={() => onFoodSelect(food)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
