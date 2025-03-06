
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, FoodSource, DataLayer } from "@/types/food";

/**
 * Find potential duplicate food items based on name and nutritional similarity
 */
export async function findDuplicateFoodItems(foodItem: FoodItem): Promise<FoodItem[]> {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .or(`name.ilike.%${foodItem.name}%,brand.ilike.%${foodItem.brand || ''}%`)
      .neq('id', foodItem.id);
    
    if (error) {
      console.error("Error searching for duplicates:", error);
      return [];
    }
    
    // Calculate similarity score (basic implementation)
    const potentialDuplicates = data
      .map(item => {
        const nameMatch = item.name.toLowerCase().includes(foodItem.name.toLowerCase());
        const brandMatch = item.brand && foodItem.brand && 
          item.brand.toLowerCase().includes(foodItem.brand.toLowerCase());
        
        const caloriesDiff = Math.abs((item.calories || 0) - (foodItem.calories || 0));
        const similarCalories = caloriesDiff < 20; // Within 20 calories
        
        let score = 0;
        if (nameMatch) score += 3;
        if (brandMatch) score += 2;
        if (similarCalories) score += 1;
        
        return { 
          ...item,
          similarityScore: score 
        };
      })
      .filter(item => item.similarityScore >= 3) // Threshold for considering as duplicate
      .sort((a, b) => b.similarityScore - a.similarityScore);
    
    // Properly cast and remove the similarityScore property before returning
    return potentialDuplicates.map(({ similarityScore, ...item }) => ({
      ...item,
      source: item.source as FoodSource,
      data_layer: item.data_layer as DataLayer
    } as FoodItem));
  } catch (error) {
    console.error("Exception finding duplicates:", error);
    return [];
  }
}

/**
 * Merge duplicate food items, keeping the primary and updating all references
 */
export async function mergeFoodItems(primaryId: string, duplicateId: string): Promise<boolean> {
  try {
    // Get both food items
    const { data: items, error: fetchError } = await supabase
      .from('food_items')
      .select('*')
      .in('id', [primaryId, duplicateId]);
    
    if (fetchError || !items || items.length !== 2) {
      console.error("Error fetching food items for merge:", fetchError);
      return false;
    }
    
    const primaryItem = items.find(item => item.id === primaryId);
    const duplicateItem = items.find(item => item.id === duplicateId);
    
    if (!primaryItem || !duplicateItem) {
      console.error("Could not find both items for merge");
      return false;
    }
    
    // Begin transaction (in real implementation, this would use a proper transaction)
    
    // 1. Update any food logs that reference the duplicate item
    const { error: logUpdateError } = await supabase
      .from('user_food_logs')
      .update({ food_item_id: primaryId })
      .eq('food_item_id', duplicateId);
    
    if (logUpdateError) {
      console.error("Error updating food logs:", logUpdateError);
      return false;
    }
    
    // 2. Update any recipes that reference the duplicate item
    const { error: recipeUpdateError } = await supabase
      .from('recipe_ingredients')
      .update({ food_item_id: primaryId })
      .eq('food_item_id', duplicateId);
    
    if (recipeUpdateError) {
      console.error("Error updating recipe ingredients:", recipeUpdateError);
      return false;
    }
    
    // 3. Update the primary item search count to combine both
    const combinedSearchCount = (primaryItem.search_count || 0) + (duplicateItem.search_count || 0);
    
    const { error: primaryUpdateError } = await supabase
      .from('food_items')
      .update({ search_count: combinedSearchCount })
      .eq('id', primaryId);
    
    if (primaryUpdateError) {
      console.error("Error updating primary food item:", primaryUpdateError);
      return false;
    }
    
    // 4. Delete the duplicate item
    const { error: deleteError } = await supabase
      .from('food_items')
      .delete()
      .eq('id', duplicateId);
    
    if (deleteError) {
      console.error("Error deleting duplicate food item:", deleteError);
      return false;
    }
    
    console.log(`Successfully merged food items: ${duplicateId} into ${primaryId}`);
    return true;
  } catch (error) {
    console.error("Exception merging food items:", error);
    return false;
  }
}
