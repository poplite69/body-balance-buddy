
import { FoodItem } from "@/types/food";

export interface CategoryState {
  common: boolean;
  branded: boolean;
}

export interface SearchResultsProps {
  searchResults: FoodItem[];
  isSearching: boolean;
  expandedCategories: CategoryState;
  toggleCategory: (category: keyof CategoryState) => void;
  onFoodSelect: (food: FoodItem) => void;
  formatMacros: (protein: number | null, fat: number | null, carbs: number | null) => string;
}

export interface RecentSearchesProps {
  recentSearches: string[];
  onRecentSearchClick: (term: string) => void;
}

export interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: () => void;
  clearSearch: () => void;
  isSearching: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export interface FoodItemCardProps {
  food: FoodItem;
  formatMacros: (protein: number | null, fat: number | null, carbs: number | null) => string;
  onClick: () => void;
}
