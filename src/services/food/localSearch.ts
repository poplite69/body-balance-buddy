
import { FoodItem, FoodSource, DataLayer } from "@/types/food";

// Cache keys for localStorage
const SEARCH_CACHE_KEY = "food_search_cache";
const FOOD_ITEM_CACHE_KEY = "food_item_cache";

// Local cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Initialize caches from localStorage or create empty ones
function initializeCache() {
  try {
    // Initialize search cache
    const storedSearchCache = localStorage.getItem(SEARCH_CACHE_KEY);
    const searchCache = storedSearchCache ? 
      new Map(Object.entries(JSON.parse(storedSearchCache))) : 
      new Map<string, { timestamp: number, results: FoodItem[] }>();
    
    // Initialize food item cache
    const storedFoodItemCache = localStorage.getItem(FOOD_ITEM_CACHE_KEY);
    const foodItemCache = storedFoodItemCache ? 
      new Map(Object.entries(JSON.parse(storedFoodItemCache))) : 
      new Map<string, FoodItem>();
    
    return { searchCache, foodItemCache };
  } catch (error) {
    console.error("Error initializing cache from localStorage:", error);
    return { 
      searchCache: new Map<string, { timestamp: number, results: FoodItem[] }>(),
      foodItemCache: new Map<string, FoodItem>() 
    };
  }
}

// Get caches
const { searchCache, foodItemCache } = initializeCache();

// Helper to save search cache to localStorage
function saveSearchCache() {
  try {
    const cacheObject = Object.fromEntries(searchCache);
    localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(cacheObject));
  } catch (error) {
    console.error("Error saving search cache to localStorage:", error);
  }
}

// Helper to save food item cache to localStorage
function saveFoodItemCache() {
  try {
    const cacheObject = Object.fromEntries(foodItemCache);
    localStorage.setItem(FOOD_ITEM_CACHE_KEY, JSON.stringify(cacheObject));
  } catch (error) {
    console.error("Error saving food item cache to localStorage:", error);
  }
}

/**
 * Get food items from local cache
 */
export function getLocalSearchResults(query: string): FoodItem[] | null {
  if (!query || query.length < 2) return null;
  
  const normalizedQuery = query.toLowerCase().trim();
  const cachedData = searchCache.get(normalizedQuery);
  
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
    console.log(`Retrieved results for "${query}" from local cache`);
    return cachedData.results;
  }
  
  return null;
}

/**
 * Store search results in local cache
 */
export function cacheSearchResults(query: string, results: FoodItem[]): void {
  if (!query || query.length < 2) return;
  
  const normalizedQuery = query.toLowerCase().trim();
  searchCache.set(normalizedQuery, {
    timestamp: Date.now(),
    results
  });
  
  // Also cache individual food items
  results.forEach(item => {
    foodItemCache.set(item.id, item);
  });
  
  // Prune cache if it gets too large (keep most recent 50 searches)
  if (searchCache.size > 50) {
    const keysToDelete = [...searchCache.keys()]
      .sort((a, b) => (searchCache.get(a)?.timestamp || 0) - (searchCache.get(b)?.timestamp || 0))
      .slice(0, searchCache.size - 50);
      
    keysToDelete.forEach(key => searchCache.delete(key));
  }
  
  // Save to localStorage
  saveSearchCache();
  saveFoodItemCache();
}

/**
 * Get a food item from local cache by ID
 */
export function getLocalFoodItem(id: string): FoodItem | null {
  const item = foodItemCache.get(id);
  if (item) {
    console.log(`Retrieved food item ${id} from local cache`);
    return item;
  }
  return null;
}

/**
 * Perform a local search within cached items
 */
export function performLocalSearch(query: string, limit = 20): FoodItem[] | null {
  if (!query || query.length < 2 || foodItemCache.size === 0) return null;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // First check for exact cache hit
  const exactMatch = getLocalSearchResults(normalizedQuery);
  if (exactMatch) return exactMatch;
  
  // Otherwise search through our cached food items
  console.log(`Performing local search for "${query}" across ${foodItemCache.size} cached items`);
  
  const results = [...foodItemCache.values()]
    .filter(item => {
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        (item.brand && item.brand.toLowerCase().includes(normalizedQuery))
      );
    })
    .sort((a, b) => (b.search_count || 0) - (a.search_count || 0))
    .slice(0, limit);
    
  // If we have enough results, cache them
  if (results.length >= 5) {
    cacheSearchResults(normalizedQuery, results);
  }
  
  return results.length > 0 ? results : null;
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  searchCache.clear();
  foodItemCache.clear();
  localStorage.removeItem(SEARCH_CACHE_KEY);
  localStorage.removeItem(FOOD_ITEM_CACHE_KEY);
  console.log("Food search cache cleared");
}
