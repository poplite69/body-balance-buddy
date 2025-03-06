
import React from 'react';
import { Link, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Exercise } from './types';

interface WorkoutExerciseHeaderProps {
  exercise: Exercise;
  onRemove?: () => void;
}

const WorkoutExerciseHeader: React.FC<WorkoutExerciseHeaderProps> = ({ 
  exercise, 
  onRemove 
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-medium">{exercise.name}</h3>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WorkoutExerciseHeader;
