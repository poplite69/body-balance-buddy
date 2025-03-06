
import React from 'react';

const WorkoutSetsHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-1 text-xs font-medium mb-1 px-1 text-muted-foreground">
      <div>SET</div>
      <div>PREV</div>
      <div>KG</div>
      <div>REPS</div>
      <div className="text-center">✓</div>
    </div>
  );
};

export default WorkoutSetsHeader;
