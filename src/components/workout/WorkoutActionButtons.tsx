
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTray } from '@/components/tray/TrayProvider';
import ExerciseSelector from './ExerciseSelector';

interface WorkoutActionButtonsProps {
  onCancelWorkout: () => void;
  cancelIsPending: boolean;
}

const WorkoutActionButtons: React.FC<WorkoutActionButtonsProps> = ({
  onCancelWorkout,
  cancelIsPending
}) => {
  const { showTray } = useTray();
  
  const handleAddExercises = () => {
    showTray(ExerciseSelector, {});
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t safe-bottom z-10">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <Button 
          onClick={handleAddExercises}
          className="w-full"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Exercises
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancelWorkout}
          disabled={cancelIsPending}
          className="px-3"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default WorkoutActionButtons;
