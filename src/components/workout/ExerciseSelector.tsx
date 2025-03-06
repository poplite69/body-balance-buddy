
import React from 'react';
import { useTray } from '@/components/tray/TrayProvider';
import ExerciseSelectorTray from './ExerciseSelectorTray';

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: any) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelectExercise 
}) => {
  const { showTray } = useTray();
  
  // When dialog is opened, show the tray instead
  React.useEffect(() => {
    if (isOpen) {
      showTray(ExerciseSelectorTray, {
        onSelectExercise
        // Don't pass onClose here, it's automatically handled by TrayProvider
      });
    }
  }, [isOpen, onSelectExercise, showTray]);

  // This component doesn't actually render anything visible
  // It just triggers the tray to open when isOpen becomes true
  return null;
};

export default ExerciseSelector;
