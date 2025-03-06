
import { supabase } from "@/integrations/supabase/client";
import { getLocalFoodItem } from "./localSearch";

/**
 * Helper to update food item usage statistics
 */
export async function updateFoodItemUsage(foodItemId: string): Promise<void> {
  const { error } = await supabase
    .from('food_items')
    .update({
      search_count: await getIncrementedValue(foodItemId),
      last_used_at: new Date().toISOString()
    })
    .eq('id', foodItemId);
    
  if (error) {
    console.error(`Error updating food item usage for ${foodItemId}:`, error);
  }
}

/**
 * Helper function to get incremented value using the database function
 */
export async function getIncrementedValue(rowId: string): Promise<number> {
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

/**
 * Get a food item by ID (with caching)
 */
export async function getFoodItemById(id: string): Promise<any | null> {
  // First check local cache
  const cachedItem = getLocalFoodItem(id);
  if (cachedItem) return cachedItem;
  
  // If not in cache, fetch from database
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching food item ${id}:`, error);
    return null;
  }
  
  return data;
}
