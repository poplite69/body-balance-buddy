
import { supabase } from "./supabase";
import { exercisesDB } from "../data/exercisesDatabase";
import { convertToSupabaseExercise } from "../data/exerciseUtils";

// Initialize the database with our starter data (exercises, etc.)
export const initializeDatabase = async () => {
  console.log("Initializing database...");
  
  try {
    // First check if the exercises table has data
    const { data: existingExercises, error: checkError } = await supabase
      .from('exercises')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error("Error checking exercises table:", checkError);
      return;
    }
    
    // If there are no exercises, insert the default ones
    if (!existingExercises || existingExercises.length === 0) {
      console.log("No exercises found, inserting default exercises...");
      
      // Convert exercises to Supabase format and insert
      const supabaseExercises = exercisesDB.map(convertToSupabaseExercise);
      
      const { error: insertError } = await supabase
        .from('exercises')
        .insert(supabaseExercises);
        
      if (insertError) {
        console.error("Error inserting exercises:", insertError);
      } else {
        console.log("Successfully inserted default exercises");
      }
    } else {
      console.log("Database already has exercises, skipping initialization");
    }
    
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
