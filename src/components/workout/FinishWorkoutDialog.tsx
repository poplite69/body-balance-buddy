
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FinishWorkoutDialogProps {
  isOpen: boolean;
  incompleteSets: number;
  onClose: () => void;
  onFinish: () => void;
}

const FinishWorkoutDialog: React.FC<FinishWorkoutDialogProps> = ({
  isOpen,
  incompleteSets,
  onClose,
  onFinish
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Incomplete Sets</DialogTitle>
        <DialogDescription>
          You have {incompleteSets} incomplete set{incompleteSets !== 1 ? 's' : ''} (sets with only weight or only reps filled). 
          These incomplete sets will be removed when finishing the workout.
        </DialogDescription>
        <DialogFooter className="mt-4 flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Go Back & Complete
          </Button>
          <Button onClick={onFinish}>
            Finish Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinishWorkoutDialog;
