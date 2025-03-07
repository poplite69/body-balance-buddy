
import { FoodItem } from "@/types/food";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SearchBar } from "./search/SearchBar";
import { RecentSearches } from "./search/RecentSearches";
import { SearchResults } from "./search/SearchResults";
import { RecentTab } from "./search/RecentTab";
import { FavoritesTab } from "./search/FavoritesTab";
import { useSearch } from "./search/useSearch";

interface EnhancedFoodSearchProps {
  onFoodSelect: (food: FoodItem) => void;
  initialQuery?: string;
}

export function EnhancedFoodSearch({ onFoodSelect, initialQuery = "" }: EnhancedFoodSearchProps) {
  const { 
    query, 
    setQuery, 
    searchResults, 
    isSearching, 
    recentSearches, 
    favoriteFoods, 
    expandedCategories, 
    activeTab, 
    setActiveTab, 
    inputRef, 
    handleSearch, 
    handleRecentSearch, 
    clearSearch, 
    toggleCategory, 
    formatMacros 
  } = useSearch(initialQuery, onFoodSelect);

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-0">
          <SearchBar 
            query={query} 
            setQuery={setQuery} 
            handleSearch={handleSearch} 
            clearSearch={clearSearch} 
            isSearching={isSearching}
            inputRef={inputRef}
          />

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
