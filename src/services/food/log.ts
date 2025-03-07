
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, FoodLog, MealType } from "@/types/food";
import { getFoodItemById } from "./utility";

/**
 * Log a food item to user's food log
 */
export async function logFood(
  userId: string,
  foodId: string,
  mealType: MealType,
  portionSize: number,
  portionUnit: string,
  overrideNutrition?: {
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
    sugar_g?: number;
  }
): Promise<FoodLog> {
  // Get food item details
  let foodItem: FoodItem;
  
  if (overrideNutrition) {
    // This is a quick-add case with provided nutrition values
    foodItem = {
      id: foodId,
      name: "Quick Add",
      brand: null,
      calories: overrideNutrition.calories || 0,
      protein_g: overrideNutrition.protein_g || 0,
      carbs_g: overrideNutrition.carbs_g || 0,
      fat_g: overrideNutrition.fat_g || 0,
      fiber_g: overrideNutrition.fiber_g || null,
      sugar_g: overrideNutrition.sugar_g || null,
      cholesterol_mg: null,
      sodium_mg: null,
      serving_size: portionSize,
      serving_unit: portionUnit,
      package_size: null,
      package_unit: null,
      piece_weight: null,
      piece_unit: null,
      external_id: null,
      search_count: 0,
      is_verified: false,
      source: "user",
      data_layer: "user",
      last_used_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } else {
    const item = await getFoodItemById(foodId);
    if (!item) {
      throw new Error(`Food item not found: ${foodId}`);
    }
    foodItem = item as FoodItem;
  }
  
  // Calculate nutrition based on portion size
  const portionMultiplier = foodItem.serving_size > 0 
    ? portionSize / foodItem.serving_size 
    : 1;
  
  const calories = Math.round((foodItem.calories || 0) * portionMultiplier);
  const protein = foodItem.protein_g !== null ? foodItem.protein_g * portionMultiplier : null;
  const carbs = foodItem.carbs_g !== null ? foodItem.carbs_g * portionMultiplier : null;
  const fat = foodItem.fat_g !== null ? foodItem.fat_g * portionMultiplier : null;
  const fiber = foodItem.fiber_g !== null ? foodItem.fiber_g * portionMultiplier : null;
  const sugar = foodItem.sugar_g !== null ? foodItem.sugar_g * portionMultiplier : null;
  
  // Create the food log entry
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('user_food_logs')
    .insert({
      user_id: userId,
      food_item_id: foodId,
      meal_type: mealType,
      portion_size: portionSize,
      portion_unit: portionUnit,
      calories,
      protein_g: protein,
      carbs_g: carbs,
      fat_g: fat,
      fiber_g: fiber,
      sugar_g: sugar,
      consumed_at: now,
    })
    .select('*')
    .single();
    
  if (error) {
    console.error('Error logging food:', error);
    throw error;
  }
  
  // Update the food item usage count in the background (don't wait for it)
  try {
    await supabase
      .from('food_items')
      .update({
        search_count: foodItem.search_count + 1,
        last_used_at: now,
      })
      .eq('id', foodId);
  } catch (err) {
    console.error('Non-critical error updating food usage stats:', err);
  }
  
  return {
    ...data,
    food_item: foodItem,
    meal_type: data.meal_type as MealType // Fix the type issue by casting
  };
}

/**
 * Delete a food log entry
 */
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

/**
 * Get food logs for a specific day
 */
export async function getFoodLogsForDay(
  userId: string, 
  dateString: string
): Promise<FoodLog[]> {
  // Convert the date string to a Date object
  const date = new Date(dateString);
  
  // Create start and end of the day in ISO format
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  
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
  
  // Transform the data to ensure type safety
  return (data || []).map(log => ({
    ...log,
    meal_type: log.meal_type as MealType, // Cast to ensure type compatibility
    food_item: log.food_item as FoodItem
  }));
}
