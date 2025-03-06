
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkoutExerciseCardProps } from './types';
import { useWorkoutSets } from './useWorkoutSets';
import WorkoutExerciseHeader from './WorkoutExerciseHeader';
import WorkoutSetsHeader from './WorkoutSetsHeader';
import WorkoutSetRow from './WorkoutSetRow';

const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  workoutId,
  exercise,
  workoutExerciseId,
  onRemove,
}) => {
  const {
    sets,
    loading,
    savingSet,
    addSet,
    updateSet
  } = useWorkoutSets({
    workoutId,
    exercise,
    workoutExerciseId
  });

  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <WorkoutExerciseHeader exercise={exercise} onRemove={onRemove} />
        
        {/* Table header */}
        <WorkoutSetsHeader />
        
        {/* Sets */}
        {loading ? (
          <div className="py-2 text-center text-muted-foreground text-sm">Loading sets...</div>
        ) : (
          <>
            {sets.map((set, index) => (
              <WorkoutSetRow 
                key={index} 
                set={set} 
                index={index} 
                updateSet={updateSet} 
                savingSet={savingSet} 
              />
            ))}
            
            {/* Add set button */}
            <Button
              variant="ghost"
              className="w-full mt-1 h-8 text-xs text-muted-foreground hover:bg-accent"
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
