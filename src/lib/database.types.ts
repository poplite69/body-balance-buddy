
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          weight: number | null
          height: number | null
          age: number | null
          gender: string | null
          fitness_level: string | null
          fitness_goals: string[] | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          weight?: number | null
          height?: number | null
          age?: number | null
          gender?: string | null
          fitness_level?: string | null
          fitness_goals?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          weight?: number | null
          height?: number | null
          age?: number | null
          gender?: string | null
          fitness_level?: string | null
          fitness_goals?: string[] | null
        }
      }
      exercises: {
        Row: {
          id: string
          created_at: string
          name: string
          category: string
          primary_muscle: string
          secondary_muscles: string[]
          equipment: string[]
          description: string
          difficulty: string
          instructions: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          category: string
          primary_muscle: string
          secondary_muscles?: string[]
          equipment?: string[]
          description?: string
          difficulty: string
          instructions?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          category?: string
          primary_muscle?: string
          secondary_muscles?: string[]
          equipment?: string[]
          description?: string
          difficulty?: string
          instructions?: string
        }
      }
      workout_templates: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
        }
      }
      template_exercises: {
        Row: {
          id: string
          created_at: string
          template_id: string
          exercise_id: string
          order: number
          suggested_sets: number
          suggested_reps: number
          suggested_rest: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          template_id: string
          exercise_id: string
          order: number
          suggested_sets: number
          suggested_reps: number
          suggested_rest?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          template_id?: string
          exercise_id?: string
          order?: number
          suggested_sets?: number
          suggested_reps?: number
          suggested_rest?: number | null
        }
      }
      workouts: {
        Row: {
          id: string
          created_at: string
          user_id: string
          template_id: string | null
          name: string
          start_time: string
          end_time: string | null
          notes: string | null
          status: string
          total_weight: number | null
          workout_duration: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          template_id?: string | null
          name: string
          start_time?: string
          end_time?: string | null
          notes?: string | null
          status?: string
          total_weight?: number | null
          workout_duration?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          template_id?: string | null
          name?: string
          start_time?: string
          end_time?: string | null
          notes?: string | null
          status?: string
          total_weight?: number | null
          workout_duration?: number | null
        }
      }
      workout_exercises: {
        Row: {
          id: string
          created_at: string
          workout_id: string
          exercise_id: string
          order: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          workout_id: string
          exercise_id: string
          order: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          workout_id?: string
          exercise_id?: string
          order?: number
          notes?: string | null
        }
      }
      workout_sets: {
        Row: {
          id: string
          created_at: string
          workout_exercise_id: string
          set_number: number
          weight: number | null
          reps: number | null
          rpe: number | null
          is_warmup: boolean
          completed: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          workout_exercise_id: string
          set_number: number
          weight?: number | null
          reps?: number | null
          rpe?: number | null
          is_warmup?: boolean
          completed?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          workout_exercise_id?: string
          set_number?: number
          weight?: number | null
          reps?: number | null
          rpe?: number | null
          is_warmup?: boolean
          completed?: boolean
          notes?: string | null
        }
      }
    }
  }
}
