
import React from 'react';
import { Timer, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import { ActiveWorkout } from '@/pages/ActiveWorkoutPage';

interface WorkoutHeaderProps {
  workout: ActiveWorkout;
  isCollapsed: boolean;
  isTimerActive: boolean;
  onCollapseToggle: () => void;
  onTimerToggle: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeUpdate: (seconds: number) => void;
  onFinish: () => void;
  finishIsPending: boolean;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workout,
  isCollapsed,
  isTimerActive,
  onCollapseToggle,
  onTimerToggle,
  onNameChange,
  onNotesChange,
  onTimeUpdate,
  onFinish,
  finishIsPending
}) => {
  return (
    <>
      {/* Top bar with timer and buttons */}
      <div className={`sticky top-0 z-10 bg-background transition-all duration-300 ${isCollapsed ? 'py-2' : 'py-4'}`}>
        <div className="flex justify-between items-center">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-12 w-12"
            onClick={onTimerToggle}
          >
            <Timer className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="default"
            className="h-12 px-8"
            onClick={onFinish}
            disabled={finishIsPending}
          >
            Finish
          </Button>
        </div>
        
        {/* Collapsible handle */}
        <div 
          className="w-full flex justify-center py-1 cursor-pointer"
          onClick={onCollapseToggle}
        >
          {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </div>
      </div>
      
      {/* Workout content - collapsible */}
      <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-screen'}`}>
        <div className="space-y-4 py-4">
          {/* Workout title & timer */}
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Input 
                className="px-0 text-3xl font-bold border-none focus-visible:ring-0 h-auto bg-transparent"
                value={workout.name}
                onChange={onNameChange}
              />
              <div className="text-xl">
                <WorkoutTimer 
                  isActive={isTimerActive} 
                  onTimeUpdate={onTimeUpdate}
                />
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Notes */}
          <div>
            <Input
              className="border-none focus-visible:ring-0 text-lg text-muted-foreground pl-0 bg-transparent"
              placeholder="Notes"
              value={workout.notes || ''}
              onChange={onNotesChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkoutHeader;
