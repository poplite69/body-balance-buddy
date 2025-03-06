
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, FoodSource, DataLayer } from "@/types/food";
import { updateFoodItemUsage } from "./utility";
import { 
  performLocalSearch, 
  getLocalSearchResults, 
  cacheSearchResults 
} from "./localSearch";

/**
 * Search for food items using a hybrid approach (local cache + database)
 */
export async function searchFoodItems(query: string, limit = 20): Promise<FoodItem[]> {
  if (!query || query.length < 2) return [];

  // First check local cache
  const localResults = getLocalSearchResults(query) || performLocalSearch(query, limit);
  
  if (localResults && localResults.length > 0) {
    // If we have enough local results, use them without a database query
    if (localResults.length >= 5) {
      console.log(`Using cached results for "${query}"`);
      
      // Update search counts in the background without waiting for it
      if (localResults.length > 0) {
        updateSearchCounts(localResults.map(item => item.id))
          .catch(err => console.error("Error updating search counts:", err));
      }
      
      return localResults;
    }
  }

  // If local search doesn't have enough results, query the database
  console.log(`Searching database for "${query}"`);
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
    .order('search_count', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error searching food items:', error);
    throw error;
  }
  
  // Update search counts in the background
  if (data && data.length > 0) {
    updateSearchCounts(data.map(item => item.id))
      .catch(err => console.error("Error updating search counts:", err));
  }
  
  // Cast the response to match our FoodItem type
  const results = data?.map(item => ({
    ...item,
    source: item.source as FoodSource,
    data_layer: item.data_layer as DataLayer
  })) || [];
  
  // Cache results for future use
  if (results.length > 0) {
    cacheSearchResults(query, results);
  }
  
  return results;
}

/**
 * Helper to update search counts for food items
 */
async function updateSearchCounts(foodItemIds: string[]): Promise<void> {
  if (!foodItemIds || foodItemIds.length === 0) return;
  
  for (const id of foodItemIds) {
    const { error } = await supabase
      .from('food_items')
      .update({
        search_count: await getIncrementedValue(id),
        last_used_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error(`Error updating search count for food item ${id}:`, error);
    }
  }
}

/**
 * Helper function to get incremented value using the database function
 */
async function getIncrementedValue(rowId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('increment_counter', { row_id: rowId });
    
    if (error) {
      console.error(`Error calling increment_counter for ${rowId}:`, error);
      return 1; // Default increment if function fails
    }
    
    return data || 1;
  } catch (err) {
    console.error(`Exception calling increment_counter for ${rowId}:`, err);
    return 1;
  }
}
