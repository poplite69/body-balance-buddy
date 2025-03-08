
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickStartSectionProps {
  onStartEmptyWorkout: () => void;
}

export const QuickStartSection = ({ onStartEmptyWorkout }: QuickStartSectionProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
      <Button 
        className="w-full py-6 text-lg" 
        onClick={onStartEmptyWorkout}
      >
        Start an Empty Workout
      </Button>
    </section>
  );
};

export default QuickStartSection;
