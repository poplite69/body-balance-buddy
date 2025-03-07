
import { useState, useEffect } from "react";
import { searchFoodItems } from "@/services/food";
import { FoodItem } from "@/types/food";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, Star, ArrowDownUp, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface EnhancedFoodSearchProps {
  onFoodSelect: (food: FoodItem) => void;
}

interface CategoryState {
  common: boolean;
  branded: boolean;
}

export function EnhancedFoodSearch({ onFoodSelect }: EnhancedFoodSearchProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<FoodItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<CategoryState>({
    common: true,
    branded: true,
  });
  const [activeTab, setActiveTab] = useState("search");

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

    // This would be replaced with an actual favorites fetching mechanism
    // For now, we'll just simulate some favorites
    const mockFavorites: FoodItem[] = []; // We'll implement this later
    setFavoriteFoods(mockFavorites);
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
      
      if (results.length > 0) {
        saveRecentSearch(query);
      }
    } catch (error) {
      console.error("Food search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecentSearch = (term: string) => {
    setQuery(term);
    setTimeout(() => handleSearch(), 100);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
  };

  const toggleCategory = (category: keyof CategoryState) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group search results by category (common vs branded)
  const categorizedResults = {
    common: searchResults.filter(item => !item.brand),
    branded: searchResults.filter(item => !!item.brand)
  };

  // Format macros in a compact "1P 2F 3C" format
  const formatMacros = (protein: number | null, fat: number | null, carbs: number | null) => {
    const p = protein ? Math.round(protein) : 0;
    const f = fat ? Math.round(fat) : 0;
    const c = carbs ? Math.round(carbs) : 0;
    return `${p}P ${f}F ${c}C`;
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-0">
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

          {recentSearches.length > 0 && searchResults.length === 0 && !isSearching && (
            <div className="my-3">
              <div className="text-sm font-medium flex items-center gap-1 mb-2">
                <Clock className="h-3 w-3" /> Recent Searches
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
                        <div 
                          key={food.id}
                          className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted cursor-pointer"
                          onClick={() => onFoodSelect(food)}
                        >
                          <div>
                            <p className="font-medium">{food.name}</p>
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
                        <div 
                          key={food.id}
                          className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted cursor-pointer"
                          onClick={() => onFoodSelect(food)}
                        >
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {food.brand}
                            </p>
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
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <div className="py-4 text-center text-muted-foreground">
            Recently used foods will appear here
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          {favoriteFoods.length > 0 ? (
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
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              You don't have any favorite foods yet
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
