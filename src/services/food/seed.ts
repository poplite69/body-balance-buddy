
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, DataLayer, FoodSource } from "@/types/food";

/**
 * Seed the core nutrition database with initial data
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
