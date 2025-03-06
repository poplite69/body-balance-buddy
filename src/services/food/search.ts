
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, FoodSource, DataLayer } from "@/types/food";
import { updateFoodItemUsage } from "./utility";

/**
 * Search for food items in the database
 */
export async function searchFoodItems(query: string, limit = 20): Promise<FoodItem[]> {
  if (!query || query.length < 2) return [];

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
    updateSearchCounts(data.map(item => item.id));
  }
  
  // Cast the response to match our FoodItem type
  return data?.map(item => ({
    ...item,
    source: item.source as FoodSource,
    data_layer: item.data_layer as DataLayer
  })) || [];
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
