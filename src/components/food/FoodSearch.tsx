import { useState, useEffect } from "react";
import { searchFoodItems } from "@/services/food";
import { clearCache } from "@/services/food/localSearch";
import { FoodItem } from "@/types/food";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, ArrowDownUp, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface FoodSearchProps {
  onFoodSelect: (food: FoodItem) => void;
}

export function FoodSearch({ onFoodSelect }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentFoodSearches");
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error("Error parsing recent searches", e);
      }
    }
  }, []);

  // Save a search term to recent searches
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    
    const normalizedTerm = term.trim();
    const updatedSearches = [
      normalizedTerm,
      ...recentSearches.filter(s => s !== normalizedTerm)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentFoodSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchFoodItems(query);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("No foods found. Try a different search term.");
      } else {
        saveRecentSearch(query);
      }
    } catch (error) {
      console.error("Food search error:", error);
      toast.error("Error searching for foods. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecentSearch = (term: string) => {
    setQuery(term);
    setSearchResults([]);
    setTimeout(() => handleSearch(), 100);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentFoodSearches");
    toast.success("Search history cleared");
  };

  const handleClearCache = () => {
    clearCache();
    toast.success("Search cache cleared");
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

        {recentSearches.length > 0 && searchResults.length === 0 && (
          <div className="my-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> Recent Searches
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={handleClearCache}
                  title="Clear all cached food data"
                >
                  <TrashIcon className="h-3 w-3 mr-1" /> Cache
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={clearRecentSearches}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, i) => (
                <Badge 
                  key={i} 
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleRecentSearch(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isSearching && (
          <div className="text-center py-6 text-muted-foreground">
            Searching...
          </div>
        )}

        {searchResults.length > 0 && !isSearching && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {searchResults.length} results
              </p>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <ArrowDownUp className="h-3 w-3" /> 
                Sorted by popularity
              </div>
            </div>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
