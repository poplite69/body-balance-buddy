
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useActiveWorkout } from '@/hooks/workout/useActiveWorkout';

import WorkoutHeader from '@/components/workout/WorkoutHeader';
import WorkoutExerciseList from '@/components/workout/WorkoutExerciseList';
import WorkoutActionButtons from '@/components/workout/WorkoutActionButtons';
import ExerciseSelector from '@/components/workout/ExerciseSelector';
import FinishWorkoutDialog from '@/components/workout/FinishWorkoutDialog';
import SaveTemplateDialog from '@/components/workout/SaveTemplateDialog';

const ActiveWorkoutPage: React.FC = () => {
  const {
    workout,
    isCollapsed,
    isTimerActive,
    isExerciseSelectorOpen,
    isFinishDialogOpen,
    isSaveTemplateDialogOpen,
    incompleteSets,
    setIsCollapsed,
    setIsTimerActive,
    setIsExerciseSelectorOpen,
    setIsFinishDialogOpen,
    setIsSaveTemplateDialogOpen,
    handleNameChange,
    handleNotesChange,
    handleTimeUpdate,
    handleAddExercise,
    handlePreFinishCheck,
    handleRemoveExercise,
    handleFinishWorkout,
    handleCancelWorkout,
    handleSaveAsTemplate,
    handleSaveTemplate,
    finishWorkoutMutation,
    cancelWorkoutMutation,
    saveAsTemplateMutation
  } = useActiveWorkout();
  
  return (
    <AppLayout showBottomNav={false}>
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
          onSaveAsTemplate={handleSaveAsTemplate}
          finishIsPending={finishWorkoutMutation.isPending}
        />
        
        <WorkoutExerciseList 
          workoutId={workout.id}
          exercises={workout.workoutExercises}
          onRemoveExercise={handleRemoveExercise}
        />
        
        <WorkoutActionButtons 
          onAddExercises={() => setIsExerciseSelectorOpen(true)}
          onCancelWorkout={handleCancelWorkout}
          cancelIsPending={cancelWorkoutMutation.isPending}
        />
        
        {/* Exercise selector dialog */}
        <ExerciseSelector
          isOpen={isExerciseSelectorOpen}
          onClose={() => setIsExerciseSelectorOpen(false)}
          onSelectExercise={handleAddExercise}
        />
        
        {/* Incomplete sets dialog */}
        <FinishWorkoutDialog 
          isOpen={isFinishDialogOpen}
          incompleteSets={incompleteSets}
          onClose={() => setIsFinishDialogOpen(false)}
          onFinish={handleFinishWorkout}
        />
        
        {/* Save template dialog */}
        <SaveTemplateDialog
          isOpen={isSaveTemplateDialogOpen}
          onClose={() => setIsSaveTemplateDialogOpen(false)}
          onSave={handleSaveTemplate}
          defaultName={workout.name}
          isSaving={saveAsTemplateMutation.isPending}
        />
      </div>
    </AppLayout>
  );
};

export default ActiveWorkoutPage;
