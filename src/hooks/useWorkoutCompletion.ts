
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ActiveWorkout, WorkoutExercise } from './useActiveWorkout';

export const useWorkoutCompletion = (workout: ActiveWorkout, setIncompleteSets: (count: number) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  
  // Check for incomplete sets
  const checkForIncompleteSets = async (): Promise<number> => {
    if (!workout.id) return 0;
    
    try {
      // Get all sets for this workout
      let incompleteSetsCount = 0;
      
      for (const workoutExercise of workout.workoutExercises) {
        const { data: sets, error } = await supabase
          .from('workout_sets')
          .select('id, weight, reps')
          .eq('workout_exercise_id', workoutExercise.id);
          
        if (error) throw error;
        
        if (sets) {
          // Count sets that have either weight or reps but not both
          const incompleteSetsByExercise = sets.filter(set => 
            (set.weight !== null && set.reps === null) || 
            (set.weight === null && set.reps !== null)
          ).length;
          
          incompleteSetsCount += incompleteSetsByExercise;
        }
      }
      
      return incompleteSetsCount;
    } catch (error) {
      console.error('Error checking for incomplete sets:', error);
      return 0;
    }
  };
  
  // Clean up incomplete sets
  const cleanUpIncompleteSets = async () => {
    if (!workout.id) return;
    
    try {
      // Loop through all workout exercises
      for (const workoutExercise of workout.workoutExercises) {
        // Get all sets for this exercise
        const { data: sets, error } = await supabase
          .from('workout_sets')
          .select('id, weight, reps')
          .eq('workout_exercise_id', workoutExercise.id);
          
        if (error) throw error;
        
        if (sets) {
          // Find incomplete sets
          const incompleteSets = sets.filter(set => 
            set.weight === null || set.reps === null
          ).map(set => set.id);
          
          // Delete incomplete sets
          if (incompleteSets.length > 0) {
            await supabase
              .from('workout_sets')
              .delete()
              .in('id', incompleteSets);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up incomplete sets:', error);
    }
  };
  
  // Mutation for finishing workout
  const finishWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!workout.id) throw new Error('No workout ID');
      
      // First clean up any incomplete sets
      await cleanUpIncompleteSets();
      
      const { error } = await supabase
        .from('workouts')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          workout_duration: workout.duration
        })
        .eq('id', workout.id);
      
      if (error) throw error;
      
      return workout.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['past-workouts'] });
      toast({
        title: 'Workout completed',
        description: 'Your workout has been saved successfully.'
      });
      navigate('/workout');
    },
    onError: (error) => {
      console.error('Error finishing workout:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to complete workout',
        description: 'There was an error saving your workout.'
      });
    }
  });
  
  // Mutation for canceling workout
  const cancelWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!workout.id) throw new Error('No workout ID');
      
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workout.id);
      
      if (error) throw error;
      
      return workout.id;
    },
    onSuccess: () => {
      toast({
        title: 'Workout canceled',
        description: 'Your workout has been canceled.'
      });
      navigate('/workout');
    },
    onError: (error) => {
      console.error('Error canceling workout:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to cancel workout',
        description: 'There was an error canceling your workout.'
      });
    }
  });
  
  // Handle pre-finish check
  const handlePreFinishCheck = async () => {
    const incompleteCount = await checkForIncompleteSets();
    
    if (incompleteCount > 0) {
      setIncompleteSets(incompleteCount);
      setIsFinishDialogOpen(true);
    } else {
      // No incomplete sets, proceed with finishing
      finishWorkoutMutation.mutate();
    }
  };
  
  // Handle finish workout
  const handleFinishWorkout = () => {
    setIsFinishDialogOpen(false);
    finishWorkoutMutation.mutate();
  };
  
  // Handle cancel workout
  const handleCancelWorkout = () => {
    cancelWorkoutMutation.mutate();
  };
  
  return {
    isFinishDialogOpen,
    setIsFinishDialogOpen,
    handlePreFinishCheck,
    handleFinishWorkout,
    handleCancelWorkout,
    finishWorkoutMutation,
    cancelWorkoutMutation
  };
};
