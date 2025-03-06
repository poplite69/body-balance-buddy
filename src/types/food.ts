
// Food-related type definitions
export type FoodSource = 'api' | 'user' | 'system';
export type DataLayer = 'core' | 'api_cache' | 'user';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  brand: string | null;
  serving_size: number;
  serving_unit: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  cholesterol_mg: number | null;
  package_size: number | null;
  package_unit: string | null;
  piece_weight: number | null;
  piece_unit: string | null;
  source: FoodSource;
  external_id: string | null;
  search_count: number;
  is_verified: boolean;
  data_layer: DataLayer;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortionOption {
  id: string;
  food_item_id: string;
  description: string;
  amount: number;
  unit: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  food_item_id: string;
  meal_type: MealType;
  portion_size: number;
  portion_unit: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  consumed_at: string;
  created_at: string;
  updated_at: string;
  food_item?: FoodItem;
}

export interface DailyNutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface MealSummary {
  meal_type: MealType;
  logs: FoodLog[];
  nutrition: DailyNutrition;
}

export interface DailySummary {
  date: string;
  meals: {
    breakfast: MealSummary;
    lunch: MealSummary;
    dinner: MealSummary;
    snack: MealSummary;
  };
  total_nutrition: DailyNutrition;
}
