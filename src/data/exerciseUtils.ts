
import { Exercise, ExerciseCategory, MuscleGroup } from './types';
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
