
import { supabase } from "@/integrations/supabase/client";

// Function to initialize database utilities like stored procedures
export async function initDatabaseUtils() {
  // Check if the increment_counter function already exists
  const { error } = await supabase.rpc('create_increment_function');
    
  if (error) {
    console.error("Error creating increment_counter function:", error);
  } else {
    console.log("Successfully created increment_counter function");
  }
}
