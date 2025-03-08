
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileSkeletonList } from '@/components/mobile/MobileSkeletonList';
import WorkoutCard from './WorkoutCard';

interface Workout {
  id: string;
  name: string;
  start_time: string;
  status: string;
}

interface PastWorkoutsSectionProps {
  workouts: Workout[] | undefined;
  isLoading: boolean;
  onWorkoutOptions: (workoutId: string) => void;
}

export const PastWorkoutsSection = ({ 
  workouts, 
  isLoading, 
  onWorkoutOptions 
}: PastWorkoutsSectionProps) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold">Past Workouts</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      
      {isLoading ? (
        <MobileSkeletonList rows={3} className="gap-4" rowHeight="h-28" />
      ) : workouts && workouts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onOptionsClick={onWorkoutOptions} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          No past workouts found. Start your fitness journey today!
        </p>
      )}
    </section>
  );
};

export default PastWorkoutsSection;
