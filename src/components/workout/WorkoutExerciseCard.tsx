import React, { useState, useEffect } from 'react';
import { Check, Plus, Link, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface WorkoutSet {
  id?: string;
  set_number: number;
  weight?: number | null;
  reps?: number | null;
  completed: boolean;
  previous_weight?: number | null;
  previous_reps?: number | null;
}

interface WorkoutExerciseCardProps {
  workoutId: string;
  exercise: {
    id: string;
    name: string;
    primary_muscle: string;
    [key: string]: any;
  };
  workoutExerciseId?: string;
}

const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  workoutId,
  exercise,
  workoutExerciseId,
}) => {
  const [sets, setSets] = useState<WorkoutSet[]>([
    { set_number: 1, completed: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [savingSet, setSavingSet] = useState<string | null>(null);
  // Track the most recently completed set in current workout
  const [lastCompletedSet, setLastCompletedSet] = useState<WorkoutSet | null>(null);
  // Track previous workout data
  const [previousWorkoutSets, setPreviousWorkoutSets] = useState<WorkoutSet[]>([]);

  // Fetch previous workout data for this exercise and create workout_exercise record if needed
  useEffect(() => {
    const initializeExercise = async () => {
      setLoading(true);
      try {
        let exerciseId = workoutExerciseId;

        // If no workout exercise ID exists, create one
        if (!exerciseId) {
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
          exerciseId = newExercise.id;
        }

        // Try to fetch existing sets if any
        const { data: existingSets, error: setsError } = await supabase
          .from('workout_sets')
          .select('*')
          .eq('workout_exercise_id', exerciseId)
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
            workout_exercise_id: exerciseId,
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
            workout_exercise_id: exerciseId,
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
  }, [workoutId, exercise.id, workoutExerciseId]);

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
        workout_exercise_id: workoutExerciseId,
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
          workout_exercise_id: workoutExerciseId,
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

  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{exercise.name}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Table header */}
        <div className="grid grid-cols-5 gap-1 text-xs font-medium mb-1 px-1 text-muted-foreground">
          <div>SET</div>
          <div>PREV</div>
          <div>KG</div>
          <div>REPS</div>
          <div className="text-center">✓</div>
        </div>
        
        {/* Sets */}
        {loading ? (
          <div className="py-2 text-center text-muted-foreground text-sm">Loading sets...</div>
        ) : (
          <>
            {sets.map((set, index) => (
              <div key={index} className="grid grid-cols-5 gap-1 mb-1">
                <div className="bg-muted rounded-md flex items-center justify-center text-xs font-medium text-muted-foreground h-8">
                  {set.set_number}
                </div>
                <div className="text-xs flex items-center text-muted-foreground">
                  {set.previous_weight !== null && set.previous_weight !== undefined && 
                   set.previous_reps !== null && set.previous_reps !== undefined ? (
                    `${set.previous_weight}×${set.previous_reps}`
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(index, 'weight', e.target.value ? Number(e.target.value) : null)}
                    className={`text-center h-8 text-xs px-1 ${set.previous_weight !== null && set.previous_weight !== undefined ? 'bg-background/90 border-muted' : ''}`}
                    placeholder={set.previous_weight !== null && set.previous_weight !== undefined ? `${set.previous_weight}` : ''}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(index, 'reps', e.target.value ? Number(e.target.value) : null)}
                    className={`text-center h-8 text-xs px-1 ${set.previous_reps !== null && set.previous_reps !== undefined ? 'bg-background/90 border-muted' : ''}`}
                    placeholder={set.previous_reps !== null && set.previous_reps !== undefined ? `${set.previous_reps}` : ''}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    variant={set.completed ? "default" : "outline"}
                    size="icon"
                    className={`rounded-md h-8 w-8 ${set.completed ? 'bg-primary hover:bg-primary/90' : 'border-muted'}`}
                    onClick={() => updateSet(index, 'completed', !set.completed)}
                    disabled={savingSet === set.id}
                  >
                    <Check className={`h-3.5 w-3.5 ${set.completed ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Add set button */}
            <Button
              variant="ghost"
              className="w-full mt-1 h-8 text-xs bg-muted/50 text-muted-foreground hover:bg-muted"
              onClick={addSet}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Set
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutExerciseCard;
