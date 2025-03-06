
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, FoodLog, MealType } from "@/types/food";

// Search for food items both in local database and potentially via API in the future
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
  
  return data || [];
}

// Get a user's food logs for a specific day
export async function getFoodLogsForDay(userId: string, date: string): Promise<FoodLog[]> {
  // Format date range for the specified day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('user_food_logs')
    .select(`
      *,
      food_item:food_item_id(*)
    `)
    .eq('user_id', userId)
    .gte('consumed_at', startOfDay.toISOString())
    .lte('consumed_at', endOfDay.toISOString())
    .order('consumed_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching food logs:', error);
    throw error;
  }
  
  return data || [];
}

// Log a food item to the user's food log
export async function logFood(
  userId: string, 
  foodItemId: string, 
  mealType: MealType, 
  portionSize: number,
  portionUnit: string,
  consumedAt: string = new Date().toISOString()
): Promise<FoodLog> {
  // Get the food item to calculate nutrition based on portion
  const { data: foodItem, error: foodItemError } = await supabase
    .from('food_items')
    .select('*')
    .eq('id', foodItemId)
    .single();
    
  if (foodItemError) {
    console.error('Error fetching food item:', foodItemError);
    throw foodItemError;
  }
  
  // Calculate nutrition multiplier based on portion
  // For simplicity, we'll use a direct multiplier if units match, otherwise a ratio
  let nutritionMultiplier = portionSize / foodItem.serving_size;
  if (portionUnit !== foodItem.serving_unit) {
    // In a real app, we would have conversion logic here
    console.warn(`Units don't match: ${portionUnit} vs ${foodItem.serving_unit}. Using direct ratio.`);
  }
  
  const logEntry = {
    user_id: userId,
    food_item_id: foodItemId,
    meal_type: mealType,
    portion_size: portionSize,
    portion_unit: portionUnit,
    consumed_at: consumedAt,
    
    // Pre-calculate all nutrition values based on portion
    calories: Math.round((foodItem.calories || 0) * nutritionMultiplier),
    protein_g: parseFloat(((foodItem.protein_g || 0) * nutritionMultiplier).toFixed(2)),
    carbs_g: parseFloat(((foodItem.carbs_g || 0) * nutritionMultiplier).toFixed(2)),
    fat_g: parseFloat(((foodItem.fat_g || 0) * nutritionMultiplier).toFixed(2)),
    fiber_g: parseFloat(((foodItem.fiber_g || 0) * nutritionMultiplier).toFixed(2)),
    sugar_g: parseFloat(((foodItem.sugar_g || 0) * nutritionMultiplier).toFixed(2))
  };
  
  // Insert the food log entry
  const { data, error } = await supabase
    .from('user_food_logs')
    .insert([logEntry])
    .select()
    .single();
    
  if (error) {
    console.error('Error logging food:', error);
    throw error;
  }
  
  // Update food item usage in the background
  updateFoodItemUsage(foodItemId);
  
  return data;
}

// Delete a food log entry
export async function deleteFoodLog(logId: string): Promise<void> {
  const { error } = await supabase
    .from('user_food_logs')
    .delete()
    .eq('id', logId);
    
  if (error) {
    console.error('Error deleting food log:', error);
    throw error;
  }
}

// Helper to update search counts for food items
async function updateSearchCounts(foodItemIds: string[]): Promise<void> {
  if (!foodItemIds || foodItemIds.length === 0) return;
  
  for (const id of foodItemIds) {
    const { error } = await supabase
      .from('food_items')
      .update({
        search_count: supabase.rpc('increment', { inc_amount: 1, row_id: id }),
        last_used_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error(`Error updating search count for food item ${id}:`, error);
    }
  }
}

// Helper to update food item usage statistics
async function updateFoodItemUsage(foodItemId: string): Promise<void> {
  const { error } = await supabase
    .from('food_items')
    .update({
      search_count: supabase.rpc('increment', { inc_amount: 1, row_id: foodItemId }),
      last_used_at: new Date().toISOString()
    })
    .eq('id', foodItemId);
    
  if (error) {
    console.error(`Error updating food item usage for ${foodItemId}:`, error);
  }
}
