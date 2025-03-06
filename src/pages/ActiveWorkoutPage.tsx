
import React, { useState } from 'react';
import WorkoutHeader from '@/components/workout/WorkoutHeader';
import WorkoutExerciseList from '@/components/workout/WorkoutExerciseList';
import WorkoutActionButtons from '@/components/workout/WorkoutActionButtons';
import FinishWorkoutDialog from '@/components/workout/FinishWorkoutDialog';
import { useActiveWorkout } from '@/hooks/useActiveWorkout';
import { useWorkoutCompletion } from '@/hooks/useWorkoutCompletion';

const ActiveWorkoutPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const {
    workout,
    isTimerActive,
    setIsTimerActive,
    incompleteSets,
    setIncompleteSets,
    handleNameChange,
    handleNotesChange,
    handleTimeUpdate,
    handleAddExercise,
    handleRemoveExercise
  } = useActiveWorkout();
  
  const {
    isFinishDialogOpen,
    setIsFinishDialogOpen,
    handlePreFinishCheck,
    handleFinishWorkout,
    handleCancelWorkout,
    finishWorkoutMutation,
    cancelWorkoutMutation
  } = useWorkoutCompletion(workout, setIncompleteSets);
  
  return (
    <div className="flex flex-col h-full min-h-[90vh] max-w-md mx-auto px-4 pb-20">
      <WorkoutHeader 
        workout={workout}
        isCollapsed={isCollapsed}
        isTimerActive={isTimerActive}
        onCollapseToggle={() => setIsCollapsed(prev => !prev)}
        onTimerToggle={() => setIsTimerActive(prev => !prev)}
        onNameChange={handleNameChange}
        onNotesChange={handleNotesChange}
        onTimeUpdate={handleTimeUpdate}
        onFinish={handlePreFinishCheck}
        finishIsPending={finishWorkoutMutation.isPending}
      />
      
      <WorkoutExerciseList 
        workoutId={workout.id}
        exercises={workout.workoutExercises}
        onRemoveExercise={handleRemoveExercise}
      />
      
      <WorkoutActionButtons 
        onAddExercise={handleAddExercise}
        onCancelWorkout={handleCancelWorkout}
        cancelIsPending={cancelWorkoutMutation.isPending}
      />
      
      {/* Incomplete sets dialog */}
      <FinishWorkoutDialog 
        isOpen={isFinishDialogOpen}
        incompleteSets={incompleteSets}
        onClose={() => setIsFinishDialogOpen(false)}
        onFinish={handleFinishWorkout}
      />
    </div>
  );
};

export default ActiveWorkoutPage;
