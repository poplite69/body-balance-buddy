
import { ExerciseWithSets, WorkoutTemplate } from './types';

// Sample workouts organized by type
export const workoutTemplates: WorkoutTemplate[] = [
  { 
    id: 'upper-strength',
    name: 'Upper Body Strength', 
    exercises: ['bench-press', 'shoulder-press', 'row-dumbbell', 'pullup'],
    lastPerformed: '2 days ago' 
  },
  { 
    id: 'lower-strength',
    name: 'Lower Body Strength', 
    exercises: ['squat-barbell', 'deadlift-romanian', 'leg-press'],
    lastPerformed: 'Yesterday' 
  },
  { 
    id: 'push-day',
    name: 'Push Day', 
    exercises: ['bench-press', 'shoulder-press', 'pushup'],
    lastPerformed: '4 days ago' 
  },
  { 
    id: 'pull-day',
    name: 'Pull Day', 
    exercises: ['pullup', 'row-dumbbell'],
    lastPerformed: '5 days ago' 
  },
];

// Sample current workout
export const currentWorkoutMock: ExerciseWithSets[] = [
  { 
    exerciseId: 'squat-barbell',
    name: 'Barbell Squat', 
    sets: [
      { weight: 225, reps: 5, completed: true },
      { weight: 225, reps: 5, completed: true },
      { weight: 225, reps: 5, completed: false },
    ] 
  },
  { 
    exerciseId: 'deadlift-romanian',
    name: 'Romanian Deadlift', 
    sets: [
      { weight: 185, reps: 8, completed: true },
      { weight: 185, reps: 8, completed: false },
      { weight: 185, reps: 8, completed: false },
    ] 
  },
  { 
    exerciseId: 'leg-press',
    name: 'Leg Press', 
    sets: [
      { weight: 360, reps: 10, completed: false },
      { weight: 360, reps: 10, completed: false },
      { weight: 360, reps: 10, completed: false },
    ] 
  },
];
