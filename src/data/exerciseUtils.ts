
import { Exercise, ExerciseCategory, ExerciseWithSets, MuscleGroup } from './types';
import { exercisesDB } from './exercisesDatabase';

// Helper function to get exercise details by ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return exercisesDB.find(exercise => exercise.id === id);
};

// Helper function to get exercises by category
export const getExercisesByCategory = (category: ExerciseCategory): Exercise[] => {
  return exercisesDB.filter(exercise => exercise.category === category);
};

// Helper function to get exercises by muscle group
export const getExercisesByMuscle = (muscleGroup: MuscleGroup): Exercise[] => {
  return exercisesDB.filter(
    exercise => 
      exercise.primaryMuscle === muscleGroup || 
      exercise.secondaryMuscles.includes(muscleGroup)
  );
};

// New helper function to sort workout exercises by completion status
export const sortExercisesByCompletion = (exercises: ExerciseWithSets[]): ExerciseWithSets[] => {
  return [...exercises].sort((a, b) => {
    // Calculate completion percentage for each exercise
    const aCompletedSets = a.sets.filter(set => set.completed).length;
    const aCompletionPercent = aCompletedSets / a.sets.length;
    
    const bCompletedSets = b.sets.filter(set => set.completed).length;
    const bCompletionPercent = bCompletedSets / b.sets.length;
    
    // Sort descending (most complete first)
    return bCompletionPercent - aCompletionPercent;
  });
};

// New helper function to filter exercises by search query
export const filterExercisesByQuery = (exercises: Exercise[], query: string): Exercise[] => {
  if (!query.trim()) return exercises;
  
  const normalizedQuery = query.toLowerCase();
  return exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(normalizedQuery) || 
    exercise.description.toLowerCase().includes(normalizedQuery) ||
    exercise.primaryMuscle.toLowerCase().includes(normalizedQuery)
  );
};

// Convert local Exercise format to Supabase database format
export const convertToSupabaseExercise = (exercise: Exercise) => {
  return {
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
    primary_muscle: exercise.primaryMuscle,
    secondary_muscles: exercise.secondaryMuscles,
    equipment: exercise.equipment,
    description: exercise.description,
    difficulty: exercise.difficulty,
    instructions: exercise.instructions
  };
};

// Convert Supabase exercise format to local Exercise format
export const convertFromSupabaseExercise = (dbExercise: any): Exercise => {
  return {
    id: dbExercise.id,
    name: dbExercise.name,
    category: dbExercise.category as ExerciseCategory,
    primaryMuscle: dbExercise.primary_muscle as MuscleGroup,
    secondaryMuscles: dbExercise.secondary_muscles as MuscleGroup[],
    equipment: dbExercise.equipment || [],
    description: dbExercise.description || '',
    difficulty: dbExercise.difficulty as 'beginner' | 'intermediate' | 'advanced',
    instructions: dbExercise.instructions || ''
  };
};
