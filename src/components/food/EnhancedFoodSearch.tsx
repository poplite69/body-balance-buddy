
import { FoodItem } from "@/types/food";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SearchResults } from "./search/SearchResults";
import { RecentTab } from "./search/RecentTab";
import { FavoritesTab } from "./search/FavoritesTab";
import { useSearch } from "./search/useSearch";
import { RecentSearches } from "./search/RecentSearches";

interface EnhancedFoodSearchProps {
  onFoodSelect: (food: FoodItem) => void;
  initialQuery?: string;
}

export function EnhancedFoodSearch({ onFoodSelect, initialQuery = "" }: EnhancedFoodSearchProps) {
  const { 
    query, 
    searchResults, 
    isSearching, 
    recentSearches, 
    favoriteFoods, 
    expandedCategories, 
    activeTab, 
    setActiveTab, 
    handleRecentSearch, 
    toggleCategory, 
    formatMacros 
  } = useSearch(initialQuery, onFoodSelect);

  return (
    <div className="p-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-2 h-8">
          <TabsTrigger value="search" className="text-xs">Search</TabsTrigger>
          <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-0">
          {recentSearches.length > 0 && searchResults.length === 0 && !isSearching && query.length < 2 && (
            <RecentSearches 
              recentSearches={recentSearches} 
              onRecentSearchClick={handleRecentSearch} 
            />
          )}

          <SearchResults 
            searchResults={searchResults} 
            isSearching={isSearching} 
            expandedCategories={expandedCategories} 
            toggleCategory={toggleCategory} 
            onFoodSelect={onFoodSelect}
            formatMacros={formatMacros}
          />
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <RecentTab />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          <FavoritesTab 
            favoriteFoods={favoriteFoods} 
            onFoodSelect={onFoodSelect} 
            formatMacros={formatMacros} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
