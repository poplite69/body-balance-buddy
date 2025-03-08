
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ActiveWorkout, Exercise } from '@/components/workout/types';

interface UseWorkoutActionsProps {
  workout: ActiveWorkout;
  setWorkout: React.Dispatch<React.SetStateAction<ActiveWorkout>>;
}

export function useWorkoutActions({ workout, setWorkout }: UseWorkoutActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen] = useState(false);
  const [incompleteSets, setIncompleteSets] = useState<number>(0);
  
  // Update workout name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setWorkout(prev => ({ ...prev, name: newName }));
    
    // Debounce update to database
    const updateName = async () => {
      if (!workout.id) return;
      
      try {
        await supabase
          .from('workouts')
          .update({ name: newName })
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
    const newNotes = e.target.value;
    setWorkout(prev => ({ ...prev, notes: newNotes }));
    
    // Debounce update to database
    const updateNotes = async () => {
      if (!workout.id) return;
      
      try {
        await supabase
          .from('workouts')
          .update({ notes: newNotes })
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
    if (!workout.id) {
      toast({
        variant: 'destructive',
        title: 'Cannot add exercise',
        description: 'Workout has not been initialized yet. Please try again.'
      });
      return;
    }
    
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
  
  // Save workout as template
  const saveAsTemplateMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string, description: string }) => {
      if (!workout.id || workout.workoutExercises.length === 0) 
        throw new Error('Missing data');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) throw new Error('Authentication required');
      
      // First, create the template
      const { data: template, error: templateError } = await supabase
        .from('workout_templates')
        .insert({
          user_id: user.user.id,
          name: name,
          description: description || null,
          is_public: false
        })
        .select()
        .single();
      
      if (templateError) throw templateError;
      
      // Then, add all exercises to the template
      const templateExercises = workout.workoutExercises.map((we, index) => ({
        template_id: template.id,
        exercise_id: we.exercise_id,
        position: index,
        suggested_sets: 3, // Default values
        suggested_reps: 10,
        suggested_rest: 60
      }));
      
      const { error: exercisesError } = await supabase
        .from('template_exercises')
        .insert(templateExercises);
      
      if (exercisesError) throw exercisesError;
      
      return template.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: 'Template saved',
        description: 'Your workout has been saved as a template'
      });
      setIsSaveTemplateDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error saving template:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save template',
        description: 'There was an error saving your workout as a template'
      });
    }
  });
  
  const handleFinishWorkout = () => {
    setIsFinishDialogOpen(false);
    finishWorkoutMutation.mutate();
  };
  
  const handleCancelWorkout = () => {
    cancelWorkoutMutation.mutate();
  };
  
  const handleSaveAsTemplate = () => {
    if (workout.workoutExercises.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cannot save empty template',
        description: 'Add exercises to your workout before saving as a template'
      });
      return;
    }
    
    setIsSaveTemplateDialogOpen(true);
  };
  
  const handleSaveTemplate = (name: string, description: string) => {
    saveAsTemplateMutation.mutate({ name, description });
  };

  return {
    isCollapsed,
    isTimerActive,
    isExerciseSelectorOpen,
    isFinishDialogOpen,
    isSaveTemplateDialogOpen,
    incompleteSets,
    setIsCollapsed,
    setIsTimerActive,
    setIsExerciseSelectorOpen,
    setIsFinishDialogOpen,
    setIsSaveTemplateDialogOpen,
    handleNameChange,
    handleNotesChange,
    handleTimeUpdate,
    handleAddExercise,
    handlePreFinishCheck,
    handleRemoveExercise,
    handleFinishWorkout,
    handleCancelWorkout,
    handleSaveAsTemplate,
    handleSaveTemplate,
    finishWorkoutMutation,
    cancelWorkoutMutation,
    saveAsTemplateMutation
  };
}
