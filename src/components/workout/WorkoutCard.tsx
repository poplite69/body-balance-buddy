
import React from 'react';
import { format } from 'date-fns';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface WorkoutCardProps {
  workout: {
    id: string;
    name: string;
    start_time: string;
    status: string;
  };
  onOptionsClick: (workoutId: string) => void;
}

export const WorkoutCard = ({ workout, onOptionsClick }: WorkoutCardProps) => {
  // Format date for display
  const workoutDate = workout.start_time 
    ? format(new Date(workout.start_time), 'MMM d, yyyy')
    : 'Unknown date';
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{workout.name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onOptionsClick(workout.id)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {workout.status === 'completed' ? 'Completed' : 'In progress'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{workoutDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WorkoutCard;
