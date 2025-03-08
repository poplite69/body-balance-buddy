
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ActiveWorkout } from '@/components/workout/types';

export function useWorkoutInitialization() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [workout, setWorkout] = useState<ActiveWorkout>({
    id: '',
    name: 'New Workout',
    start_time: new Date().toISOString(),
    workoutExercises: [],
    duration: 0
  });

  // Create a new workout
  const createWorkout = async () => {
    if (!user) {
      setLoading(false);
      setError(new Error('Authentication required'));
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to start a workout'
      });
      return null;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: workout.name,
          start_time: new Date().toISOString(),
          status: 'in_progress'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setWorkout(prev => ({
          ...prev,
          id: data.id,
          start_time: data.start_time
        }));
        
        toast({
          title: 'Workout started',
          description: 'Your workout has been started successfully.'
        });
        
        return data.id;
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      setError(error instanceof Error ? error : new Error('Failed to start workout'));
      toast({
        variant: 'destructive',
        title: 'Failed to start workout',
        description: 'There was an error starting your workout.'
      });
      return null;
    } finally {
      setLoading(false);
    }
    
    return null;
  };

  // Fetch workout exercises whenever workout ID changes
  useEffect(() => {
    const fetchWorkoutExercises = async () => {
      if (!workout.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('workout_exercises')
          .select(`
            id,
            exercise_id,
            exercise:exercises(*)
          `)
          .eq('workout_id', workout.id)
          .order('position');
          
        if (error) throw error;
        
        if (data) {
          setWorkout(prev => ({
            ...prev,
            workoutExercises: data
          }));
        }
      } catch (error) {
        console.error('Error fetching workout exercises:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch exercises'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkoutExercises();
  }, [workout.id]);
  
  return {
    workout,
    setWorkout,
    loading,
    error,
    createWorkout
  };
}
