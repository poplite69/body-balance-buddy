export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty: string
          equipment: string[] | null
          id: string
          instructions: string | null
          name: string
          primary_muscle: string
          secondary_muscles: string[] | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty: string
          equipment?: string[] | null
          id?: string
          instructions?: string | null
          name: string
          primary_muscle: string
          secondary_muscles?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string
          equipment?: string[] | null
          id?: string
          instructions?: string | null
          name?: string
          primary_muscle?: string
          secondary_muscles?: string[] | null
        }
        Relationships: []
      }
      favorite_foods: {
        Row: {
          created_at: string | null
          food_item_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          food_item_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          food_item_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_foods_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          brand: string | null
          calories: number | null
          carbs_g: number | null
          cholesterol_mg: number | null
          created_at: string | null
          data_layer: string
          external_id: string | null
          fat_g: number | null
          fiber_g: number | null
          id: string
          is_verified: boolean | null
          last_used_at: string | null
          name: string
          package_size: number | null
          package_unit: string | null
          piece_unit: string | null
          piece_weight: number | null
          protein_g: number | null
          search_count: number | null
          serving_size: number
          serving_unit: string
          sodium_mg: number | null
          source: string
          sugar_g: number | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          calories?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          created_at?: string | null
          data_layer: string
          external_id?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          is_verified?: boolean | null
          last_used_at?: string | null
          name: string
          package_size?: number | null
          package_unit?: string | null
          piece_unit?: string | null
          piece_weight?: number | null
          protein_g?: number | null
          search_count?: number | null
          serving_size: number
          serving_unit: string
          sodium_mg?: number | null
          source: string
          sugar_g?: number | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          calories?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          created_at?: string | null
          data_layer?: string
          external_id?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          is_verified?: boolean | null
          last_used_at?: string | null
          name?: string
          package_size?: number | null
          package_unit?: string | null
          piece_unit?: string | null
          piece_weight?: number | null
          protein_g?: number | null
          search_count?: number | null
          serving_size?: number
          serving_unit?: string
          sodium_mg?: number | null
          source?: string
          sugar_g?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      food_portion_options: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          food_item_id: string
          id: string
          is_default: boolean | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          food_item_id: string
          id?: string
          is_default?: boolean | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          food_item_id?: string
          id?: string
          is_default?: boolean | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_portion_options_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          fitness_goals: string[] | null
          fitness_level: string | null
          full_name: string | null
          gender: string | null
          height: number | null
          id: string
          updated_at: string | null
          username: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id: string
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          created_at: string | null
          food_item_id: string
          id: string
          quantity: number
          recipe_id: string
          unit: string
        }
        Insert: {
          created_at?: string | null
          food_item_id: string
          id?: string
          quantity: number
          recipe_id: string
          unit: string
        }
        Update: {
          created_at?: string | null
          food_item_id?: string
          id?: string
          quantity?: number
          recipe_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "user_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      template_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          position: number
          suggested_reps: number
          suggested_rest: number | null
          suggested_sets: number
          template_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          position: number
          suggested_reps: number
          suggested_rest?: number | null
          suggested_sets: number
          template_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          position?: number
          suggested_reps?: number
          suggested_rest?: number | null
          suggested_sets?: number
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_exercises_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_food_logs: {
        Row: {
          calories: number | null
          carbs_g: number | null
          consumed_at: string
          created_at: string | null
          fat_g: number | null
          fiber_g: number | null
          food_item_id: string
          id: string
          meal_type: string
          portion_size: number
          portion_unit: string
          protein_g: number | null
          sugar_g: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          consumed_at: string
          created_at?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          food_item_id: string
          id?: string
          meal_type: string
          portion_size: number
          portion_unit: string
          protein_g?: number | null
          sugar_g?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          consumed_at?: string
          created_at?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          food_item_id?: string
          id?: string
          meal_type?: string
          portion_size?: number
          portion_unit?: string
          protein_g?: number | null
          sugar_g?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_food_logs_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recipes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          is_public: boolean | null
          name: string
          preparation_steps: string | null
          servings: number
          total_calories: number | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_protein_g: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          name: string
          preparation_steps?: string | null
          servings: number
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          name?: string
          preparation_steps?: string | null
          servings?: number
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          notes: string | null
          position: number
          workout_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          notes?: string | null
          position: number
          workout_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          notes?: string | null
          position?: number
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          is_warmup: boolean | null
          notes: string | null
          reps: number | null
          rpe: number | null
          set_number: number
          weight: number | null
          workout_exercise_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          is_warmup?: boolean | null
          notes?: string | null
          reps?: number | null
          rpe?: number | null
          set_number: number
          weight?: number | null
          workout_exercise_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          is_warmup?: boolean | null
          notes?: string | null
          reps?: number | null
          rpe?: number | null
          set_number?: number
          weight?: number | null
          workout_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          name: string
          notes: string | null
          start_time: string | null
          status: string | null
          template_id: string | null
          total_weight: number | null
          user_id: string
          workout_duration: number | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          name: string
          notes?: string | null
          start_time?: string | null
          status?: string | null
          template_id?: string | null
          total_weight?: number | null
          user_id: string
          workout_duration?: number | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          name?: string
          notes?: string | null
          start_time?: string | null
          status?: string | null
          template_id?: string | null
          total_weight?: number | null
          user_id?: string
          workout_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_increment_function: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      increment_counter: {
        Args: {
          row_id: string
        }
        Returns: number
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
