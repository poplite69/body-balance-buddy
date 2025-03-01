
export type ExerciseCategory = 
  | 'compound'
  | 'upper_push' 
  | 'upper_pull'
  | 'lower_body'
  | 'core'
  | 'cardio';

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'forearms'
  | 'full_body'
  | 'lower_back'
  | 'core';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: string[];
  description: string;
  difficulty: Difficulty;
  instructions: string;
}

export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseWithSets {
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: string[];
  lastPerformed?: string;
  isPublic?: boolean;
  createdAt?: string;
}

export interface TemplateExercise {
  id: string;
  templateId: string;
  exerciseId: string;
  position: number;
  suggestedSets: number;
  suggestedReps: number;
  suggestedRest?: number;
}
