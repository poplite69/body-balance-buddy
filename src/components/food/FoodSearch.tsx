
import { useState } from "react";
import { searchFoodItems } from "@/services/food";
import { FoodItem } from "@/types/food";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { toast } from "sonner";

interface FoodSearchProps {
  onFoodSelect: (food: FoodItem) => void;
}

export function FoodSearch({ onFoodSelect }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchFoodItems(query);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info("No foods found. Try a different search term.");
      }
    } catch (error) {
      console.error("Food search error:", error);
      toast.error("Error searching for foods. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search for a food..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-8"
            />
            {query && (
              <X
                className="absolute top-1/2 right-2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={clearSearch}
              />
            )}
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={!query.trim() || isSearching}
            className="w-10 h-10 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.map((food) => (
              <div 
                key={food.id}
                className="flex justify-between items-center p-2 rounded border hover:bg-muted cursor-pointer"
                onClick={() => onFoodSelect(food)}
              >
                <div>
                  <p className="font-medium">{food.name}</p>
                  {food.brand && <p className="text-sm text-muted-foreground">{food.brand}</p>}
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
        )}
      </CardContent>
    </Card>
  );
}
