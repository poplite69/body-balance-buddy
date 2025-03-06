
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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
        onSelectExercise,
        onClose
      });
    }
  }, [isOpen, onSelectExercise, onClose, showTray]);

  // This component doesn't actually render anything visible
  // It just triggers the tray to open when isOpen becomes true
  return null;
};

export default ExerciseSelector;
