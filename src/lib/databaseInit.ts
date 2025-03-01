
import { supabase } from './supabase';
import { exercisesDB } from '@/data/exercisesDatabase';

export const seedExercises = async () => {
  try {
    // Check if exercises already exist
    const { count } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true });

    // If we already have exercises, don't seed again
    if (count && count > 0) {
      console.log(`Database already has ${count} exercises`);
      return;
    }

    // Prepare exercises for insertion
    const exercisesToInsert = exercisesDB.map(exercise => ({
      name: exercise.name,
      category: exercise.category,
      primary_muscle: exercise.primaryMuscle,
      secondary_muscles: exercise.secondaryMuscles,
      equipment: exercise.equipment,
      description: exercise.description,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions
    }));

    // Insert exercises
    const { error } = await supabase
      .from('exercises')
      .insert(exercisesToInsert);

    if (error) {
      console.error('Error seeding exercises:', error);
    } else {
      console.log(`Successfully seeded ${exercisesToInsert.length} exercises`);
    }
  } catch (error) {
    console.error('Error in seed process:', error);
  }
};

export const initializeDatabase = async () => {
  try {
    // Seed exercises table
    await seedExercises();
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};
