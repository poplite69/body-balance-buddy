
-- Enable RLS on all tables
alter table auth.users enable row level security;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  weight NUMERIC,
  height NUMERIC,
  age INTEGER,
  gender TEXT,
  fitness_level TEXT,
  fitness_goals TEXT[]
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  primary_muscle TEXT NOT NULL,
  secondary_muscles TEXT[],
  equipment TEXT[],
  description TEXT,
  difficulty TEXT NOT NULL,
  instructions TEXT
);

-- Create workout templates table
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE
);

-- Create template exercises junction table
CREATE TABLE IF NOT EXISTS public.template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  order INTEGER NOT NULL,
  suggested_sets INTEGER NOT NULL,
  suggested_reps INTEGER NOT NULL,
  suggested_rest INTEGER
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT DEFAULT 'in_progress',
  total_weight NUMERIC,
  workout_duration INTEGER
);

-- Create workout exercises junction table
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  order INTEGER NOT NULL,
  notes TEXT
);

-- Create workout sets table
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  workout_exercise_id UUID REFERENCES public.workout_exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INTEGER NOT NULL,
  weight NUMERIC,
  reps INTEGER,
  rpe NUMERIC,
  is_warmup BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Set up Row Level Security policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY profiles_select_policy ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY profiles_insert_policy ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update_policy ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Exercises: Everyone can read, only admins can modify (handled in application)
CREATE POLICY exercises_select_policy ON public.exercises 
  FOR SELECT USING (true);

-- Workout templates: Users can read public templates or their own, and only modify their own
CREATE POLICY workout_templates_select_policy ON public.workout_templates 
  FOR SELECT USING (is_public OR auth.uid() = user_id);

CREATE POLICY workout_templates_insert_policy ON public.workout_templates 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY workout_templates_update_policy ON public.workout_templates 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY workout_templates_delete_policy ON public.workout_templates 
  FOR DELETE USING (auth.uid() = user_id);

-- Template exercises: Same rules as the parent templates
CREATE POLICY template_exercises_select_policy ON public.template_exercises 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates t 
      WHERE t.id = template_id AND (t.is_public OR t.user_id = auth.uid())
    )
  );

CREATE POLICY template_exercises_insert_policy ON public.template_exercises 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_templates t 
      WHERE t.id = template_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY template_exercises_update_policy ON public.template_exercises 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates t 
      WHERE t.id = template_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY template_exercises_delete_policy ON public.template_exercises 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates t 
      WHERE t.id = template_id AND t.user_id = auth.uid()
    )
  );

-- Workouts: Users can only see and modify their own workouts
CREATE POLICY workouts_select_policy ON public.workouts 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY workouts_insert_policy ON public.workouts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY workouts_update_policy ON public.workouts 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY workouts_delete_policy ON public.workouts 
  FOR DELETE USING (auth.uid() = user_id);

-- Workout exercises: Same rules as the parent workouts
CREATE POLICY workout_exercises_select_policy ON public.workout_exercises 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workouts w 
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY workout_exercises_insert_policy ON public.workout_exercises 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts w 
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY workout_exercises_update_policy ON public.workout_exercises 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workouts w 
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY workout_exercises_delete_policy ON public.workout_exercises 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workouts w 
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

-- Workout sets: Same rules as the parent workout exercises
CREATE POLICY workout_sets_select_policy ON public.workout_sets 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON we.workout_id = w.id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY workout_sets_insert_policy ON public.workout_sets 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON we.workout_id = w.id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY workout_sets_update_policy ON public.workout_sets 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON we.workout_id = w.id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY workout_sets_delete_policy ON public.workout_sets 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON we.workout_id = w.id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
