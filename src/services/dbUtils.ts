
import { supabase } from "@/integrations/supabase/client";

// Function to initialize database utilities like stored procedures
export async function initDatabaseUtils() {
  // Check if the increment_counter function already exists
  const { data: existingFunctions, error: checkError } = await supabase
    .from('pg_proc')
    .select('proname')
    .eq('proname', 'increment_counter')
    .limit(1);
    
  if (checkError) {
    console.error("Error checking for existing functions:", checkError);
    return;
  }
  
  // If the function doesn't exist, create it
  if (!existingFunctions || existingFunctions.length === 0) {
    const { error } = await supabase.rpc('create_increment_function');
    
    if (error) {
      console.error("Error creating increment_counter function:", error);
    } else {
      console.log("Successfully created increment_counter function");
    }
  }
}
