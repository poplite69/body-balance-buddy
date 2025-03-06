
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import ExerciseSelector from '@/components/workout/ExerciseSelector';
import WorkoutExerciseCard from '@/components/workout/WorkoutExerciseCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Exercise {
  id: string;
  name: string;
  primary_muscle: string;
  [key: string]: any;
}

interface WorkoutExercise {
  id: string;
  exercise_id: string;
  exercise: Exercise;
}

interface WorkoutSet {
  id: string;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  workout_exercise_id: string;
}

interface ActiveWorkout {
  id: string;
  name: string;
  start_time: string;
  workoutExercises: WorkoutExercise[];
  notes?: string;
  duration: number;
}

const ActiveWorkoutPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workout, setWorkout] = useState<ActiveWorkout>({
    id: '',
    name: 'New Workout',
    start_time: new Date().toISOString(),
    workoutExercises: [],
    duration: 0
  });
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
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
  
  // Handle finish workout
  const handleFinishWorkout = () => {
    setIsFinishDialogOpen(false);
    finishWorkoutMutation.mutate();
  };
  
  // Handle cancel workout
  const handleCancelWorkout = () => {
    cancelWorkoutMutation.mutate();
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
  
  return (
    <div className="flex flex-col h-full min-h-[90vh] max-w-md mx-auto px-4 pb-20">
      {/* Top bar with timer and buttons */}
      <div className={`sticky top-0 z-10 bg-background transition-all duration-300 ${isCollapsed ? 'py-2' : 'py-4'}`}>
        <div className="flex justify-between items-center">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-12 w-12"
            onClick={() => setIsTimerActive(prev => !prev)}
          >
            <Timer className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="default"
            className="h-12 px-8"
            onClick={handlePreFinishCheck}
            disabled={finishWorkoutMutation.isPending}
          >
            Finish
          </Button>
        </div>
        
        {/* Collapsible handle */}
        <div 
          className="w-full flex justify-center py-1 cursor-pointer"
          onClick={() => setIsCollapsed(prev => !prev)}
        >
          {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </div>
      </div>
      
      {/* Workout content - collapsible */}
      <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-screen'}`}>
        <div className="space-y-4 py-4">
          {/* Workout title & timer */}
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Input 
                className="px-0 text-3xl font-bold border-none focus-visible:ring-0 h-auto bg-transparent"
                value={workout.name}
                onChange={handleNameChange}
              />
              <div className="text-xl">
                <WorkoutTimer 
                  isActive={isTimerActive} 
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Notes */}
          <div>
            <Input
              className="border-none focus-visible:ring-0 text-lg text-muted-foreground pl-0 bg-transparent"
              placeholder="Notes"
              value={workout.notes || ''}
              onChange={handleNotesChange}
            />
          </div>
        </div>
      </div>
      
      {/* Exercise list */}
      <div className="flex-1">
        {workout.workoutExercises.length > 0 ? (
          <div className="space-y-3 my-4">
            {workout.workoutExercises.map((workoutExercise) => (
              <WorkoutExerciseCard
                key={workoutExercise.id}
                workoutId={workout.id}
                exercise={workoutExercise.exercise}
                workoutExerciseId={workoutExercise.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p>No exercises added yet</p>
          </div>
        )}
      </div>
      
      {/* Add exercises button */}
      <Button 
        variant="outline"
        className="w-full py-6 my-4"
        onClick={() => setIsExerciseSelectorOpen(true)}
      >
        Add Exercises
      </Button>
      
      {/* Cancel workout button */}
      <Button 
        variant="destructive" 
        className="w-full py-6 mb-8"
        onClick={handleCancelWorkout}
        disabled={cancelWorkoutMutation.isPending}
      >
        Cancel Workout
      </Button>
      
      {/* Exercise selector dialog */}
      <ExerciseSelector
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        onSelectExercise={handleAddExercise}
      />
      
      {/* Incomplete sets dialog */}
      <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
        <DialogContent>
          <DialogTitle>Incomplete Sets</DialogTitle>
          <DialogDescription>
            You have {incompleteSets} incomplete set{incompleteSets !== 1 ? 's' : ''} (sets with only weight or only reps filled). 
            These incomplete sets will be removed when finishing the workout.
          </DialogDescription>
          <DialogFooter className="mt-4 flex space-x-2">
            <Button variant="outline" onClick={() => setIsFinishDialogOpen(false)}>
              Go Back & Complete
            </Button>
            <Button onClick={handleFinishWorkout}>
              Finish Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveWorkoutPage;
