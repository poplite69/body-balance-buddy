
import React from 'react';
import { Dumbbell } from 'lucide-react';
import WorkoutExerciseCard from '@/components/workout/WorkoutExerciseCard';
import { Skeleton } from '@/components/ui/skeleton';

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

interface WorkoutExerciseListProps {
  workoutId: string;
  exercises: WorkoutExercise[];
  onRemoveExercise: (exerciseId: string) => void;
  isLoading?: boolean;
}

const WorkoutExerciseList: React.FC<WorkoutExerciseListProps> = ({ 
  workoutId, 
  exercises,
  onRemoveExercise,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3 my-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1">
      {exercises.length > 0 ? (
        <div className="space-y-3 my-4">
          {exercises.map((workoutExercise) => (
            <WorkoutExerciseCard
              key={workoutExercise.id}
              workoutId={workoutId}
              exercise={workoutExercise.exercise}
              workoutExerciseId={workoutExercise.id}
              onRemove={() => onRemoveExercise(workoutExercise.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Dumbbell className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-lg">No exercises added yet</p>
          <p className="text-sm">Add exercises using the button below</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutExerciseList;
