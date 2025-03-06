
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Exercise } from '@/components/workout/types';

export interface WorkoutExercise {
  id: string;
  exercise_id: string;
  exercise: Exercise;
}

export interface WorkoutSet {
  id: string;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  workout_exercise_id: string;
}

export interface ActiveWorkout {
  id: string;
  name: string;
  start_time: string;
  workoutExercises: WorkoutExercise[];
  notes?: string;
  duration: number;
}

export const useActiveWorkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [workout, setWorkout] = useState<ActiveWorkout>({
    id: '',
    name: 'New Workout',
    start_time: new Date().toISOString(),
    workoutExercises: [],
    duration: 0
  });
  
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [incompleteSets, setIncompleteSets] = useState<number>(0);
  
  // Create workout on initial load
  useEffect(() => {
    const createWorkout = async () => {
      if (!user) return;
      
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
        }
      } catch (error) {
        console.error('Error creating workout:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to start workout',
          description: 'There was an error starting your workout.'
        });
      }
    };
    
    createWorkout();
  }, [user, toast]);

  // Fetch workout exercises whenever workout ID changes
  useEffect(() => {
    const fetchWorkoutExercises = async () => {
      if (!workout.id) return;
      
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
      }
    };
    
    fetchWorkoutExercises();
  }, [workout.id]);
  
  // Update workout name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkout(prev => ({ ...prev, name: e.target.value }));
    
    // Debounce update to database
    const updateName = async () => {
      if (!workout.id) return;
      
      try {
        await supabase
          .from('workouts')
          .update({ name: e.target.value })
          .eq('id', workout.id);
      } catch (error) {
        console.error('Error updating workout name:', error);
      }
    };
    
    const timeoutId = setTimeout(updateName, 500);
    return () => clearTimeout(timeoutId);
  };
  
  // Update workout notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkout(prev => ({ ...prev, notes: e.target.value }));
    
    // Debounce update to database
    const updateNotes = async () => {
      if (!workout.id) return;
      
      try {
        await supabase
          .from('workouts')
          .update({ notes: e.target.value })
          .eq('id', workout.id);
      } catch (error) {
        console.error('Error updating workout notes:', error);
      }
    };
    
    const timeoutId = setTimeout(updateNotes, 500);
    return () => clearTimeout(timeoutId);
  };
  
  // Handle timer update
  const handleTimeUpdate = (seconds: number) => {
    setWorkout(prev => ({ ...prev, duration: seconds }));
  };
  
  // Add exercise to workout
  const handleAddExercise = async (exercise: Exercise) => {
    if (!workout.id) return;
    
    try {
      // Add exercise to workout_exercises table
      const { data: workoutExercise, error } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: workout.id,
          exercise_id: exercise.id,
          position: workout.workoutExercises.length
        })
        .select(`
          id,
          exercise_id,
          exercise:exercises(*)
        `)
        .single();
      
      if (error) throw error;
      
      // Update local state
      setWorkout(prev => ({
        ...prev,
        workoutExercises: [...prev.workoutExercises, workoutExercise]
      }));
      
      toast({
        title: 'Exercise added',
        description: `${exercise.name} added to your workout.`
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to add exercise',
        description: 'There was an error adding the exercise to your workout.'
      });
    }
  };
  
  // Remove exercise
  const handleRemoveExercise = async (exerciseId: string) => {
    if (!workout.id) return;
    
    try {
      await supabase
        .from('workout_exercises')
        .delete()
        .eq('id', exerciseId);
        
      setWorkout(prev => ({
        ...prev,
        workoutExercises: prev.workoutExercises.filter(ex => ex.id !== exerciseId)
      }));
      
      toast({
        title: 'Exercise removed',
        description: 'Exercise has been removed from your workout.'
      });
    } catch (error) {
      console.error('Error removing exercise:', error);
    }
  };
  
  return {
    workout,
    setWorkout,
    isTimerActive,
    setIsTimerActive,
    incompleteSets,
    setIncompleteSets,
    handleNameChange,
    handleNotesChange,
    handleTimeUpdate,
    handleAddExercise,
    handleRemoveExercise
  };
};
