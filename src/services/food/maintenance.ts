
import { supabase } from "@/integrations/supabase/client";

// Define an interface for the stats returned by the database function
export interface FoodDatabaseStats {
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
    
    // 1. Clean up orphaned records - using stored procedure
    console.log("Calling cleanup function");
    const cleanupResult = await supabase.rpc('cleanup_orphaned_food_records');
    
    if (cleanupResult.error) {
      report.push(`Error cleaning up orphaned records: ${cleanupResult.error.message}`);
    } else {
      report.push("Orphaned records cleaned successfully");
    }
    
    // 2. Update usage statistics - using stored procedure
    console.log("Calling update stats function");
    const statsResult = await supabase.rpc('update_food_usage_statistics');
    
    if (statsResult.error) {
      report.push(`Error updating food usage statistics: ${statsResult.error.message}`);
    } else {
      report.push("Food usage statistics updated successfully");
    }
    
    // 3. Generate report on database health - using stored procedure
    const statsQueryResult = await supabase.rpc('get_food_database_stats');
    
    if (statsQueryResult.error || !statsQueryResult.data) {
      report.push(`Error retrieving database statistics: ${statsQueryResult.error?.message || "No data returned"}`);
    } else {
      // First cast to unknown, then to our interface to avoid type issues
      const statsData = statsQueryResult.data as unknown;
      const stats = statsData as FoodDatabaseStats;
      
      report.push(`Total food items: ${stats.total_count}`);
      report.push(`Core items: ${stats.core_count}`);
      report.push(`API cached items: ${stats.api_count}`);
      report.push(`User created items: ${stats.user_count}`);
      report.push(`Items with no usage in 90+ days: ${stats.unused_count}`);
    }
    
    return { 
      success: true, 
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
