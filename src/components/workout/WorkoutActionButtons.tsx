
import React from 'react';
import { Button } from '@/components/ui/button';

interface WorkoutActionButtonsProps {
  onAddExercises: () => void;
  onCancelWorkout: () => void;
  cancelIsPending: boolean;
}

const WorkoutActionButtons: React.FC<WorkoutActionButtonsProps> = ({
  onAddExercises,
  onCancelWorkout,
  cancelIsPending
}) => {
  return (
    <>
      {/* Add exercises button */}
      <Button 
        variant="outline"
        className="w-full py-6 my-4"
        onClick={onAddExercises}
      >
        Add Exercises
      </Button>
      
      {/* Cancel workout button */}
      <Button 
        variant="destructive" 
        className="w-full py-6 mb-8"
        onClick={onCancelWorkout}
        disabled={cancelIsPending}
      >
        Cancel Workout
      </Button>
    </>
  );
};

export default WorkoutActionButtons;
