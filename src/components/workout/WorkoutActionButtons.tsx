
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTrayConfirmation } from '@/components/tray/useTrayConfirmation';
import { useTray } from '@/components/tray/TrayProvider';
import ExerciseSelector from './ExerciseSelector';
import { Exercise } from './types';

interface WorkoutActionButtonsProps {
  onAddExercise: (exercise: Exercise) => void;
  onCancelWorkout: () => void;
  cancelIsPending: boolean;
}

const WorkoutActionButtons: React.FC<WorkoutActionButtonsProps> = ({
  onAddExercise,
  onCancelWorkout,
  cancelIsPending
}) => {
  const { confirm } = useTrayConfirmation();
  const { showTray } = useTray();
  
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
  
  const handleAddExercises = () => {
    showTray(ExerciseSelector, {
      onSelectExercise: onAddExercise
    });
  };
  
  return (
    <>
      {/* Add exercises button */}
      <Button 
        variant="outline"
        className="w-full py-6 my-4"
        onClick={handleAddExercises}
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
