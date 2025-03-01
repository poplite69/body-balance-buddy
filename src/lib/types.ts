
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyNutrition {
  date: Date;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  entries: FoodEntry[];
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: Date;
}

export interface AIInsight {
  id: string;
  date: Date;
  message: string;
  category: 'workout' | 'nutrition' | 'sleep' | 'recovery' | 'general';
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardData {
  workouts: Workout[];
  nutrition: DailyNutrition;
  journalEntries: JournalEntry[];
  insights: AIInsight[];
  metrics: HealthMetric[];
}
