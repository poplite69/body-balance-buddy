
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, DataLayer, FoodSource } from "@/types/food";

/**
 * Database seeding functions
 */
export async function seedCoreNutritionData() {
  try {
    const { count } = await supabase
      .from('food_items')
      .select('*', { count: 'exact', head: true })
      .eq('data_layer', 'core');
    
    if (count && count > 100) {
      console.log("Core nutrition database already seeded");
      return { success: true, message: "Core database already seeded" };
    }
    
    console.log("Seeding core nutrition database...");
    
    // Mock implementation - in production, this would import from a file or API
    const coreItems: Omit<FoodItem, 'id' | 'created_at' | 'updated_at' | 'last_used_at'>[] = [
      {
        name: "Apple",
        brand: null,
        serving_size: 1,
        serving_unit: "medium (182g)",
        calories: 95,
        protein_g: 0.5,
        carbs_g: 25,
        fat_g: 0.3,
        fiber_g: 4.4,
        sugar_g: 19,
        sodium_mg: 2,
        cholesterol_mg: 0,
        source: "system" as FoodSource,
        external_id: null,
        is_verified: true,
        data_layer: "core" as DataLayer,
        search_count: 0,
        package_size: null,
        package_unit: null,
        piece_weight: 182,
        piece_unit: "g"
      },
      {
        name: "Banana",
        brand: null,
        serving_size: 1,
        serving_unit: "medium (118g)",
        calories: 105,
        protein_g: 1.3,
        carbs_g: 27,
        fat_g: 0.4,
        fiber_g: 3.1,
        sugar_g: 14.4,
        sodium_mg: 1,
        cholesterol_mg: 0,
        source: "system" as FoodSource,
        external_id: null,
        is_verified: true,
        data_layer: "core" as DataLayer,
        search_count: 0,
        package_size: null,
        package_unit: null,
        piece_weight: 118,
        piece_unit: "g"
      },
      // In a real implementation, there would be many more items
    ];
    
    // Insert core items in batches
    const { error } = await supabase
      .from('food_items')
      .insert(coreItems);
    
    if (error) {
      console.error("Error seeding core nutrition data:", error);
      return { success: false, message: error.message };
    }
    
    console.log("Core nutrition database seeded successfully");
    return { success: true, message: "Core database seeded successfully" };
  } catch (error) {
    console.error("Exception seeding core nutrition data:", error);
    return { success: false, message: String(error) };
  }
}

/**
 * Data layer management
 */
export async function promoteUserItemToCore(foodItemId: string): Promise<boolean> {
  try {
    // First get the item
    const { data: item, error: fetchError } = await supabase
      .from('food_items')
      .select('*')
      .eq('id', foodItemId)
      .single();
    
    if (fetchError || !item) {
      console.error("Error fetching food item:", fetchError);
      return false;
    }
    
    // Only user-created items can be promoted
    if (item.data_layer !== 'user') {
      console.error("Only user-created items can be promoted to core");
      return false;
    }
    
    // Update the data layer
    const { error: updateError } = await supabase
      .from('food_items')
      .update({ 
        data_layer: 'core' as DataLayer,
        is_verified: true
      })
      .eq('id', foodItemId);
    
    if (updateError) {
      console.error("Error promoting food item:", updateError);
      return false;
    }
    
    console.log(`Food item ${foodItemId} promoted to core layer`);
    return true;
  } catch (error) {
    console.error("Exception promoting food item:", error);
    return false;
  }
}

/**
 * Duplicate detection
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
    // Using type assertion to handle the potential source type mismatch
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
        
        // Cast item to FoodItem type to ensure source is handled correctly
        const typedItem = {
          ...item,
          source: item.source as FoodSource
        } as FoodItem;
        
        return { ...typedItem, similarityScore: score };
      })
      .filter(item => item.similarityScore >= 3) // Threshold for considering as duplicate
      .sort((a, b) => b.similarityScore - a.similarityScore);
    
    // Remove the similarityScore property before returning
    return potentialDuplicates.map(({ similarityScore, ...item }) => item);
  } catch (error) {
    console.error("Exception finding duplicates:", error);
    return [];
  }
}

/**
 * Merge duplicate food items
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

// Define an interface for the stats returned by the database function
interface FoodDatabaseStats {
  total_count: number;
  core_count: number;
  api_count: number;
  user_count: number;
  unused_count: number;
}

/**
 * Run maintenance tasks on the food database
 */
export async function runFoodDatabaseMaintenance(): Promise<{ success: boolean, report: string }> {
  try {
    const report: string[] = ["Food database maintenance report:"];
    
    // 1. Clean up orphaned records
    // Use a direct SELECT to execute the function instead of rpc
    const { error: cleanupError } = await supabase
      .from('_temp_output')
      .select('*')
      .eq('dummy', 1)
      .then(() => supabase.query('SELECT cleanup_orphaned_food_records()'));
    
    if (cleanupError) {
      report.push(`Error cleaning up orphaned records: ${cleanupError.message}`);
    } else {
      report.push("Orphaned records cleaned successfully");
    }
    
    // 2. Update usage statistics
    // Use a direct SELECT to execute the function instead of rpc
    const { error: statsError } = await supabase
      .from('_temp_output')
      .select('*')
      .eq('dummy', 1)
      .then(() => supabase.query('SELECT update_food_usage_statistics()'));
    
    if (statsError) {
      report.push(`Error updating food usage statistics: ${statsError.message}`);
    } else {
      report.push("Food usage statistics updated successfully");
    }
    
    // 3. Generate report on database health
    // Use a direct SELECT to execute the function instead of rpc
    const { data: stats, error: reportError } = await supabase
      .from('_temp_output')
      .select('*')
      .eq('dummy', 1)
      .then(() => supabase.query<FoodDatabaseStats>('SELECT get_food_database_stats()'));
    
    if (reportError || !stats || !stats[0]) {
      report.push(`Error generating database stats: ${reportError?.message || "No data returned"}`);
    } else {
      const dbStats = stats[0];
      report.push(`Total food items: ${dbStats.total_count}`);
      report.push(`Core items: ${dbStats.core_count}`);
      report.push(`API cached items: ${dbStats.api_count}`);
      report.push(`User created items: ${dbStats.user_count}`);
      report.push(`Items with no usage in 90+ days: ${dbStats.unused_count}`);
    }
    
    return { 
      success: !cleanupError && !statsError && !reportError, 
      report: report.join('\n') 
    };
  } catch (error) {
    console.error("Exception running food database maintenance:", error);
    return { 
      success: false, 
      report: `Maintenance failed with error: ${String(error)}` 
    };
  }
}

/**
 * Initialize database with seed data if needed
 */
export async function initializeFoodDatabase() {
  try {
    // Check if we need to seed the database
    const { count } = await supabase
      .from('food_items')
      .select('*', { count: 'exact', head: true });
    
    if (!count || count < 10) {
      console.log("Food database needs seeding");
      await seedCoreNutritionData();
    } else {
      console.log(`Food database already contains ${count} items`);
    }
  } catch (error) {
    console.error("Error initializing food database:", error);
  }
}
