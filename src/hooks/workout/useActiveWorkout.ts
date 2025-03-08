
import { useState, useEffect } from 'react';
import { useWorkoutInitialization } from './useWorkoutInitialization';
import { useWorkoutActions } from './useWorkoutActions';
import { WorkoutSet } from '@/components/workout/types';

export function useActiveWorkout() {
  // Initialize workout and fetch data
  const { 
    workout, 
    setWorkout,
    loading,
    error,
    createWorkout
  } = useWorkoutInitialization();
  
  const [initialized, setInitialized] = useState(false);
  
  // Initialize workout on component mount
  useEffect(() => {
    if (!initialized && !workout.id) {
      createWorkout().then(workoutId => {
        if (workoutId) {
          setInitialized(true);
        }
      });
    }
  }, [initialized, workout.id, createWorkout]);
  
  // Set up workout actions
  const {
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
  } = useWorkoutActions({ workout, setWorkout });

  return {
    workout,
    isCollapsed,
    isTimerActive,
    isExerciseSelectorOpen,
    isFinishDialogOpen,
    isSaveTemplateDialogOpen,
    incompleteSets,
    loading: loading || !initialized,
    error,
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
  };
}
