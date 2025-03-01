
import { Exercise } from './types';

// Initial Database of Exercises
export const exercisesDB: Exercise[] = [
  // Compound Movements
  {
    id: 'squat-barbell',
    name: 'Barbell Squat',
    category: 'compound',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'calves'],
    equipment: ['barbell', 'squat rack'],
    description: 'A compound lower body exercise that targets multiple muscle groups',
    difficulty: 'intermediate',
    instructions: 'Stand with feet shoulder-width apart, barbell across shoulders. Lower until thighs are parallel to ground, then drive through heels to return to starting position.'
  },
  {
    id: 'deadlift-romanian',
    name: 'Romanian Deadlift',
    category: 'compound',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'lower_back'],
    equipment: ['barbell'],
    description: 'A hip-hinge movement that targets the posterior chain',
    difficulty: 'intermediate',
    instructions: 'Hold barbell at hip level. Keeping back straight and knees slightly bent, hinge at hips to lower weight toward feet until you feel stretch in hamstrings, then return to starting position.'
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'upper_push',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    description: 'The classic chest building exercise',
    difficulty: 'intermediate',
    instructions: 'Lie on bench with feet on floor. Grip barbell slightly wider than shoulders, lower to chest, then press up to full extension.'
  },
  
  // Upper Body Push
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    category: 'upper_push',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: ['dumbbells'],
    description: 'A vertical pushing movement that targets shoulders',
    difficulty: 'intermediate', 
    instructions: 'Sit or stand with dumbbells at shoulder height, palms forward. Press weights overhead until arms fully extend, then lower back to starting position.'
  },
  {
    id: 'pushup',
    name: 'Push-Up',
    category: 'upper_push',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders', 'core'],
    equipment: [],
    description: 'A bodyweight exercise that strengthens the upper body',
    difficulty: 'beginner',
    instructions: 'Start in plank position with hands slightly wider than shoulders. Lower body until chest nearly touches floor, then push back up.'
  },
  
  // Upper Body Pull
  {
    id: 'pullup',
    name: 'Pull-Up',
    category: 'upper_pull',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: ['pull-up bar'],
    description: 'A bodyweight exercise that targets the back and biceps',
    difficulty: 'intermediate',
    instructions: 'Hang from bar with hands wider than shoulders, palms facing away. Pull body up until chin clears bar, then lower back to hanging position.'
  },
  {
    id: 'row-dumbbell',
    name: 'Dumbbell Row',
    category: 'upper_pull',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['dumbbell', 'bench'],
    description: 'A unilateral back exercise',
    difficulty: 'beginner',
    instructions: 'Place one knee and hand on bench, opposite foot on floor. Hold dumbbell with free hand, arm extended. Pull dumbbell to hip, keeping elbow close to body, then lower.'
  },
  
  // Lower Body
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'lower_body',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: ['leg press machine'],
    description: 'A machine-based lower body exercise',
    difficulty: 'beginner',
    instructions: 'Sit on machine with feet on platform. Release safety, lower platform by bending knees until they approach chest, then press back to starting position.'
  },
  {
    id: 'lunge-walking',
    name: 'Walking Lunges',
    category: 'lower_body',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'calves'],
    equipment: ['dumbbells'],
    description: 'A dynamic lower body exercise',
    difficulty: 'intermediate',
    instructions: 'Hold dumbbells at sides. Step forward with one leg, lowering hips until both knees at 90 degrees. Push through front foot to bring back leg forward into next lunge.'
  },
  
  // Core
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    primaryMuscle: 'abs',
    secondaryMuscles: ['shoulders', 'lower_back'],
    equipment: [],
    description: 'An isometric core exercise',
    difficulty: 'beginner',
    instructions: 'Start in push-up position but with forearms on ground. Keep body straight from head to heels, holding position while bracing core.'
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'core',
    primaryMuscle: 'abs',
    secondaryMuscles: [],
    equipment: ['weight plate', 'medicine ball'],
    description: 'A rotational core exercise',
    difficulty: 'intermediate',
    instructions: 'Sit on floor with knees bent, feet slightly off ground. Hold weight at chest, lean back slightly, and twist torso to touch weight to floor on each side.'
  },
  
  // Cardio
  {
    id: 'running',
    name: 'Running',
    category: 'cardio',
    primaryMuscle: 'full_body',
    secondaryMuscles: [],
    equipment: [],
    description: 'Cardiovascular exercise that engages the entire body',
    difficulty: 'beginner',
    instructions: 'Start at comfortable pace, maintaining upright posture with slight forward lean. Land midfoot with each step, arms bent at 90 degrees swinging from shoulders.'
  }
];
