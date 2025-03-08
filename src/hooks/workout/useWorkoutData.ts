
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Template {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  exercises: { name: string }[];
}

interface Workout {
  id: string;
  name: string;
  start_time: string;
  status: string;
}

export const useWorkoutData = (user: User | null) => {
  // Fetch workout templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['workout-templates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: templates, error } = await supabase
        .from('workout_templates')
        .select(`
          id, 
          name, 
          description, 
          created_at,
          template_exercises!inner (
            exercise_id,
            exercises (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (error) {
        console.error('Error fetching templates:', error);
        return [];
      }
      
      return templates.map((t: any) => ({
        ...t,
        exercises: t.template_exercises.map((te: any) => te.exercises)
      }));
    },
    enabled: !!user,
  });
  
  // Fetch past workouts
  const { data: pastWorkouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ['past-workouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: workouts, error } = await supabase
        .from('workouts')
        .select('id, name, start_time, status')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(6);
        
      if (error) {
        console.error('Error fetching workouts:', error);
        return [];
      }
      
      return workouts;
    },
    enabled: !!user,
  });

  return {
    templates,
    templatesLoading,
    pastWorkouts,
    workoutsLoading
  };
};
