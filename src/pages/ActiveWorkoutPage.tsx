
import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useActiveWorkout } from '@/hooks/workout/useActiveWorkout';
import { MobileSkeletonList } from '@/components/mobile/MobileSkeletonList';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import WorkoutHeader from '@/components/workout/WorkoutHeader';
import WorkoutExerciseList from '@/components/workout/WorkoutExerciseList';
import WorkoutActionButtons from '@/components/workout/WorkoutActionButtons';
import ExerciseSelector from '@/components/workout/ExerciseSelector';
import FinishWorkoutDialog from '@/components/workout/FinishWorkoutDialog';
import SaveTemplateDialog from '@/components/workout/SaveTemplateDialog';

const ActiveWorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, user, navigate]);

  const {
    workout,
    isCollapsed,
    isTimerActive,
    isExerciseSelectorOpen,
    isFinishDialogOpen,
    isSaveTemplateDialogOpen,
    incompleteSets,
    loading,
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
  } = useActiveWorkout();
  
  // Handle authentication loading state
  if (authLoading) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="flex flex-col h-full min-h-[90vh] max-w-md mx-auto px-4 py-6 justify-center items-center">
          <Skeleton className="h-12 w-full max-w-xs" />
          <div className="mt-4 text-center text-muted-foreground">
            Checking authentication...
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="flex flex-col h-full min-h-[90vh] max-w-md mx-auto px-4 py-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || "There was a problem starting your workout"}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/workout')}
            className="mt-4 flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Workouts
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  // Handle loading state
  if (loading || !workout.id) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="flex flex-col h-full min-h-[90vh] max-w-md mx-auto px-4 pb-20">
          <div className="space-y-4 py-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <MobileSkeletonList rows={3} />
          <div className="mt-auto pt-6">
            <Skeleton className="h-12 w-full mb-3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }
  
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
          isLoading={loading}
        />
        
        <WorkoutExerciseList 
          workoutId={workout.id}
          exercises={workout.workoutExercises}
          onRemoveExercise={handleRemoveExercise}
          isLoading={loading}
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
