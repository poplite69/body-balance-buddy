import { FoodItem, FoodSource, DataLayer } from "@/types/food";

// In-memory cache to store recent searches and results
const searchCache = new Map<string, {
  timestamp: number,
  results: FoodItem[]
}>();

// Cache for individual food items
const foodItemCache = new Map<string, FoodItem>();

// Local cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

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
