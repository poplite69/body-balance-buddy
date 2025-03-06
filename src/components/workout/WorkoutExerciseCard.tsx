
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

        // Find the last workout where this exercise was used
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
            // Get sets from previous workout
            const { data: prevSets, error: prevSetsError } = await supabase
              .from('workout_sets')
              .select('set_number, weight, reps')
              .eq('workout_exercise_id', prevExercise.id)
              .order('set_number');
              
            if (!prevSetsError && prevSets) {
              previousSets = prevSets.map(set => ({
                ...set,
                previous_weight: set.weight,
                previous_reps: set.reps,
                weight: null,
                reps: null,
                completed: false
              }));
            }
          }
        }

        // If we have existing sets, use those
        if (existingSets && existingSets.length > 0) {
          setSets(existingSets);
        } 
        // Otherwise, if we have previous sets, use those as a template
        else if (previousSets.length > 0) {
          // Create initial sets based on previous workout
          setSets(previousSets);
          
          // Also create them in the database
          const newSets = previousSets.map(set => ({
            workout_exercise_id: exerciseId,
            set_number: set.set_number,
            weight: null,
            reps: null,
            completed: false
          }));
          
          await supabase.from('workout_sets').insert(newSets);
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

  const addSet = async () => {
    try {
      const newSetNumber = sets.length + 1;
      
      // Find previous data for this set number if exists
      const previousSet = sets.find(s => s.set_number === newSetNumber - 1);
      
      const newSet = {
        workout_exercise_id: workoutExerciseId,
        set_number: newSetNumber,
        weight: null,
        reps: null,
        completed: false,
        previous_weight: previousSet?.weight || null,
        previous_reps: previousSet?.reps || null
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
                  {set.previous_weight !== null && set.previous_reps !== null ? (
                    `${set.previous_weight}×${set.previous_reps}`
                  ) : (
                    '-'
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(index, 'weight', e.target.value ? Number(e.target.value) : null)}
                    className={`text-center h-8 text-xs px-1 ${set.previous_weight !== null ? 'bg-background/90 border-muted' : ''}`}
                    placeholder={set.previous_weight !== null ? `${set.previous_weight}` : ''}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(index, 'reps', e.target.value ? Number(e.target.value) : null)}
                    className={`text-center h-8 text-xs px-1 ${set.previous_reps !== null ? 'bg-background/90 border-muted' : ''}`}
                    placeholder={set.previous_reps !== null ? `${set.previous_reps}` : ''}
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
