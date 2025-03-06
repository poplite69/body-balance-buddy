
import { supabase } from "@/integrations/supabase/client";
import { DataLayer } from "@/types/food";

/**
 * Promote a user-created food item to the core data layer
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
