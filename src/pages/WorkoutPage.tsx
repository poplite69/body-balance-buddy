
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkoutData } from '@/hooks/workout/useWorkoutData';
import QuickStartSection from '@/components/workout/QuickStartSection';
import TemplatesSection from '@/components/workout/TemplatesSection';
import PastWorkoutsSection from '@/components/workout/PastWorkoutsSection';

const WorkoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    templates, 
    templatesLoading, 
    pastWorkouts, 
    workoutsLoading 
  } = useWorkoutData(user);

  // Start empty workout handler
  const handleStartEmptyWorkout = () => {
    navigate('/active-workout');
  };
  
  // Template option handler
  const handleTemplateOptions = (templateId: string) => {
    console.log('Template options clicked for', templateId);
  };
  
  // Past workout option handler
  const handleWorkoutOptions = (workoutId: string) => {
    console.log('Workout options clicked for', workoutId);
  };

  return (
    <AppLayout>
      <div className="container p-4 pt-6 pb-20 space-y-8 max-w-md mx-auto">
        <header>
          <h1 className="text-4xl font-bold mb-6">Workouts</h1>
        </header>

        {/* Quick Start Section */}
        <QuickStartSection onStartEmptyWorkout={handleStartEmptyWorkout} />

        {/* Templates Section */}
        <TemplatesSection 
          templates={templates} 
          isLoading={templatesLoading}
          onTemplateOptions={handleTemplateOptions}
        />

        {/* Past Workouts Section */}
        <PastWorkoutsSection 
          workouts={pastWorkouts} 
          isLoading={workoutsLoading}
          onWorkoutOptions={handleWorkoutOptions}
        />
      </div>
    </AppLayout>
  );
};

export default WorkoutPage;
