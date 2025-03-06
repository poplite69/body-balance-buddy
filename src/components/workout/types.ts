
export interface WorkoutSet {
  id?: string;
  set_number: number;
  weight?: number | null;
  reps?: number | null;
  completed: boolean;
  previous_weight?: number | null;
  previous_reps?: number | null;
}

export interface Exercise {
  id: string;
  name: string;
  primary_muscle: string;
  secondary_muscles?: string[];
  equipment?: string[];
  description?: string;
  instructions?: string;
  [key: string]: any;
}

export interface WorkoutExerciseCardProps {
  workoutId: string;
  exercise: Exercise;
  workoutExerciseId?: string;
  onRemove?: () => void;
}
