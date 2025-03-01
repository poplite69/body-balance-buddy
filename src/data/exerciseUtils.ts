
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
