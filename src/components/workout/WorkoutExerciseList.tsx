
import React from 'react';
import WorkoutExerciseCard from '@/components/workout/WorkoutExerciseCard';

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
}

const WorkoutExerciseList: React.FC<WorkoutExerciseListProps> = ({ 
  workoutId, 
  exercises,
  onRemoveExercise
}) => {
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
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <p>No exercises added yet</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutExerciseList;
