
import { useState, useEffect, useRef } from "react";
import { FoodItem } from "@/types/food";
import { searchFoodItems } from "@/services/food";
import { CategoryState } from "./types";

export function useSearch(initialQuery: string, onFoodSelect: (food: FoodItem) => void) {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<FoodItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<CategoryState>({
    common: true,
    branded: true,
  });
  const [activeTab, setActiveTab] = useState("search");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  // Initialize search with initialQuery if provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length >= 2) {
      handleSearch();
    }
  }, [initialQuery]);

  // Update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Auto-search as user types (debounced)
  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [query]);

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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleCategory = (category: keyof CategoryState) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Format macros in a compact "1P 2F 3C" format
  const formatMacros = (protein: number | null, fat: number | null, carbs: number | null) => {
    const p = protein ? Math.round(protein) : 0;
    const f = fat ? Math.round(fat) : 0;
    const c = carbs ? Math.round(carbs) : 0;
    return `${p}P ${f}F ${c}C`;
  };

  return {
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
  };
}
