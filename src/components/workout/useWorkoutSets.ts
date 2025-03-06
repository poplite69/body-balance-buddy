import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutSet, Exercise } from './types';

interface UseWorkoutSetsProps {
  workoutId: string;
  exercise: Exercise;
  workoutExerciseId?: string;
}

export const useWorkoutSets = ({ workoutId, exercise, workoutExerciseId }: UseWorkoutSetsProps) => {
  const [sets, setSets] = useState<WorkoutSet[]>([
    { set_number: 1, completed: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [savingSet, setSavingSet] = useState<string | null>(null);
  const [lastCompletedSet, setLastCompletedSet] = useState<WorkoutSet | null>(null);
  const [previousWorkoutSets, setPreviousWorkoutSets] = useState<WorkoutSet[]>([]);
  const [exerciseId, setExerciseId] = useState<string | undefined>(workoutExerciseId);

  // Fetch previous workout data for this exercise and create workout_exercise record if needed
  useEffect(() => {
    const initializeExercise = async () => {
      setLoading(true);
      try {
        let currentExerciseId = exerciseId;

        // If no workout exercise ID exists, create one
        if (!currentExerciseId) {
          const { data: newExercise, error: createError } = await supabase
            .from('workout_exercises')
            .insert({
              workout_id: workoutId,
              exercise_id: exercise.id,
              position: 0, // You might want to determine this dynamically
            })
            .select('id')
            .single();

          if (createError) throw createError;
          currentExerciseId = newExercise.id;
          setExerciseId(currentExerciseId);
        }

        // Try to fetch existing sets if any
        const { data: existingSets, error: setsError } = await supabase
          .from('workout_sets')
          .select('*')
          .eq('workout_exercise_id', currentExerciseId)
          .order('set_number');

        if (setsError) throw setsError;

        // Find the last workout where this exercise was used and was completed
        const { data: previousWorkout, error: previousError } = await supabase
          .from('workouts')
          .select('id')
          .eq('status', 'completed')
          .order('end_time', { ascending: false })
          .limit(1);

        let previousSets: WorkoutSet[] = [];
        
        if (!previousError && previousWorkout && previousWorkout.length > 0) {
          // Find the exercise in the previous workout
          const { data: prevExercise, error: prevExError } = await supabase
            .from('workout_exercises')
            .select('id')
            .eq('workout_id', previousWorkout[0].id)
            .eq('exercise_id', exercise.id)
            .single();
            
          if (!prevExError && prevExercise) {
            // Get COMPLETED sets from previous workout (both weight and reps must be filled)
            const { data: prevSets, error: prevSetsError } = await supabase
              .from('workout_sets')
              .select('set_number, weight, reps')
              .eq('workout_exercise_id', prevExercise.id)
              .not('weight', 'is', null)
              .not('reps', 'is', null)
              .order('set_number');
              
            if (!prevSetsError && prevSets && prevSets.length > 0) {
              // Only use completed sets from previous workout
              previousSets = prevSets.map(set => ({
                ...set,
                previous_weight: set.weight,
                previous_reps: set.reps,
                weight: null,
                reps: null,
                completed: false
              }));
              
              // Store previous sets for later reference when adding new sets
              setPreviousWorkoutSets(previousSets);
            }
          }
        }

        // If we have existing sets, use those
        if (existingSets && existingSets.length > 0) {
          setSets(existingSets);
          
          // Find the last completed set in the existing sets
          const completedSets = existingSets.filter(set => 
            set.weight !== null && set.reps !== null
          );
          
          if (completedSets.length > 0) {
            setLastCompletedSet(completedSets[completedSets.length - 1]);
          }
        } 
        // Otherwise, if we have previous completed sets, use the first one as a template
        else if (previousSets.length > 0) {
          // Create initial set based on first previous set
          setSets([previousSets[0]]);
          
          // Create the set in the database
          const initialSet = {
            workout_exercise_id: currentExerciseId,
            set_number: 1,
            weight: null,
            reps: null,
            completed: false
          };
          
          const { data: newSet } = await supabase
            .from('workout_sets')
            .insert(initialSet)
            .select()
            .single();
            
          if (newSet) {
            setSets([{
              id: newSet.id,
              set_number: 1,
              weight: null,
              reps: null,
              completed: false,
              previous_weight: previousSets[0].previous_weight,
              previous_reps: previousSets[0].previous_reps
            }]);
          }
        } 
        // Otherwise, just start with one empty set
        else {
          const initialSet = {
            workout_exercise_id: currentExerciseId,
            set_number: 1,
            weight: null,
            reps: null,
            completed: false
          };
          
          const { data: newSet } = await supabase
            .from('workout_sets')
            .insert(initialSet)
            .select()
            .single();
            
          setSets([{
            id: newSet?.id,
            set_number: 1,
            weight: null,
            reps: null,
            completed: false
          }]);
        }
      } catch (error) {
        console.error('Error setting up exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeExercise();
  }, [workoutId, exercise.id, exerciseId]);

  // Determine the best values to prefill for a new set based on priorities
  const getBestPrefillValues = () => {
    // Priority 1: Use the most recent completed set in the current workout
    if (lastCompletedSet) {
      return {
        previous_weight: lastCompletedSet.weight,
        previous_reps: lastCompletedSet.reps
      };
    }
    
    // Priority 2: Use the last set from the previous workout 
    if (previousWorkoutSets.length > 0) {
      const lastPrevSet = previousWorkoutSets[previousWorkoutSets.length - 1];
      return {
        previous_weight: lastPrevSet.previous_weight,
        previous_reps: lastPrevSet.previous_reps
      };
    }
    
    // Priority 3: Use values from the most recently added set in current workout
    if (sets.length > 0) {
      const lastSet = sets[sets.length - 1];
      if (lastSet.weight !== null || lastSet.reps !== null) {
        return {
          previous_weight: lastSet.weight,
          previous_reps: lastSet.reps
        };
      }
    }
    
    // Default: empty values
    return {
      previous_weight: null,
      previous_reps: null
    };
  };

  const addSet = async () => {
    try {
      const newSetNumber = sets.length + 1;
      
      // Get prefill values based on our priority logic
      const prefillValues = getBestPrefillValues();
      
      const newSet = {
        workout_exercise_id: exerciseId,
        set_number: newSetNumber,
        weight: null,
        reps: null,
        completed: false,
        previous_weight: prefillValues.previous_weight,
        previous_reps: prefillValues.previous_reps
      };
      
      // Add to database
      const { data, error } = await supabase
        .from('workout_sets')
        .insert({
          workout_exercise_id: exerciseId,
          set_number: newSetNumber,
          weight: null,
          reps: null,
          completed: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update state
      setSets(prev => [...prev, { ...newSet, id: data.id }]);
    } catch (error) {
      console.error('Error adding set:', error);
    }
  };

  const updateSet = async (index: number, field: 'weight' | 'reps' | 'completed', value: any) => {
    const updatedSets = [...sets];
    const set = { ...updatedSets[index] };
    
    // @ts-ignore: field type is narrowed
    set[field] = value;
    updatedSets[index] = set;
    
    setSets(updatedSets);
    
    // If this set is now complete (has both weight and reps), update lastCompletedSet
    if (isSetComplete(set)) {
      setLastCompletedSet(set);
    }
    
    // Update in database
    if (set.id) {
      setSavingSet(set.id);
      try {
        const { error } = await supabase
          .from('workout_sets')
          .update({ [field]: value })
          .eq('id', set.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating set:', error);
      } finally {
        setSavingSet(null);
      }
    }
  };

  // Helper to check if a set is complete (has both weight and reps)
  const isSetComplete = (set: WorkoutSet) => {
    return set.weight !== null && set.reps !== null;
  };

  // Get number of incomplete sets
  const getIncompleteSetsCount = () => {
    return sets.filter(set => !isSetComplete(set)).length;
  };

  return {
    sets,
    loading,
    savingSet,
    addSet,
    updateSet,
    getIncompleteSetsCount,
    exerciseId
  };
};
