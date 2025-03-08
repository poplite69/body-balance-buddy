
import { FoodItem } from "@/types/food";
import { SearchResults } from "./search/SearchResults";
import { RecentTab } from "./search/RecentTab";
import { FavoritesTab } from "./search/FavoritesTab";
import { useSearch } from "./search/useSearch";
import { RecentSearches } from "./search/RecentSearches";
import { FoodSearchTabs } from "./search/FoodSearchTabs";

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

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <>
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
          </>
        );
      case "recent":
        return <RecentTab />;
      case "favorites":
        return (
          <FavoritesTab 
            favoriteFoods={favoriteFoods} 
            onFoodSelect={onFoodSelect} 
            formatMacros={formatMacros} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-2">
      <FoodSearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-2">
        {renderContent()}
      </div>
    </div>
  );
}
