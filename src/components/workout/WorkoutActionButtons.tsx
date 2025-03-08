
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTrayConfirmation } from '@/components/tray/useTrayConfirmation';

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
  const { confirm } = useTrayConfirmation();
  
  const handleCancelWorkout = () => {
    confirm({
      id: 'cancel-workout',
      title: 'Cancel Workout',
      message: 'Are you sure you want to cancel this workout? All progress will be lost.',
      confirmText: 'Yes, Cancel',
      cancelText: 'No, Keep Working Out',
      danger: true,
      onConfirm: onCancelWorkout
    });
  };
  
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
        onClick={handleCancelWorkout}
        disabled={cancelIsPending}
      >
        Cancel Workout
      </Button>
    </>
  );
};

export default WorkoutActionButtons;
