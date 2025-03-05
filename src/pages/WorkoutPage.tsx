
import React from 'react';
import { Plus, Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { MobileSkeletonList } from '@/components/mobile/MobileSkeletonList';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

type Template = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  exercises: { name: string }[];
};

type Workout = {
  id: string;
  name: string;
  start_time: string;
  status: string;
};

const WorkoutPage = () => {
  const { user } = useAuth();
  
  // Fetch workout templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['workout-templates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: templates, error } = await supabase
        .from('workout_templates')
        .select(`
          id, 
          name, 
          description, 
          created_at,
          template_exercises!inner (
            exercise_id,
            exercises (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (error) {
        console.error('Error fetching templates:', error);
        return [];
      }
      
      return templates.map(t => ({
        ...t,
        exercises: t.template_exercises.map((te: any) => te.exercises)
      }));
    },
    enabled: !!user,
  });
  
  // Fetch past workouts
  const { data: pastWorkouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ['past-workouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: workouts, error } = await supabase
        .from('workouts')
        .select('id, name, start_time, status')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(6);
        
      if (error) {
        console.error('Error fetching workouts:', error);
        return [];
      }
      
      return workouts;
    },
    enabled: !!user,
  });

  // Start empty workout handler
  const handleStartEmptyWorkout = () => {
    // TODO: Implement starting a new empty workout
    console.log('Starting empty workout');
  };
  
  // Template option handler
  const handleTemplateOptions = (templateId: string) => {
    console.log('Template options clicked for', templateId);
  };
  
  // Past workout option handler
  const handleWorkoutOptions = (workoutId: string) => {
    console.log('Workout options clicked for', workoutId);
  };

  // Render workout template card
  const renderTemplateCard = (template: Template) => {
    // Format exercise names for display
    const exerciseText = template.exercises
      .slice(0, 3)
      .map(e => e.name)
      .join(', ');
    
    // Calculate days ago
    const daysAgo = Math.floor(
      (new Date().getTime() - new Date(template.created_at).getTime()) / (1000 * 3600 * 24)
    );
    
    return (
      <Card key={template.id} className="w-full">
        <CardContent className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{template.name}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleTemplateOptions(template.id)}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{exerciseText}</p>
        </CardContent>
        <CardFooter className="p-4 pt-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago</span>
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  // Render past workout card
  const renderWorkoutCard = (workout: Workout) => {
    // Format date for display
    const workoutDate = workout.start_time 
      ? format(new Date(workout.start_time), 'MMM d, yyyy')
      : 'Unknown date';
    
    return (
      <Card key={workout.id} className="w-full">
        <CardContent className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{workout.name}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleWorkoutOptions(workout.id)}
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

  return (
    <div className="container p-4 pt-6 pb-20 space-y-8 max-w-md mx-auto">
      <header>
        <h1 className="text-4xl font-bold mb-6">Workouts</h1>
      </header>

      {/* Quick Start Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
        <Button 
          className="w-full py-6 text-lg" 
          onClick={handleStartEmptyWorkout}
        >
          Start an Empty Workout
        </Button>
      </section>

      {/* Templates Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Templates</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Templates subheader */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">
            My Templates {templates && `(${templates.length})`}
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        {templatesLoading ? (
          <MobileSkeletonList rows={3} className="gap-4" rowHeight="h-28" />
        ) : templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map(renderTemplateCard)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No templates found. Create your first template.
          </p>
        )}
      </section>

      {/* Past Workouts Section */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">Past Workouts</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        {workoutsLoading ? (
          <MobileSkeletonList rows={3} className="gap-4" rowHeight="h-28" />
        ) : pastWorkouts && pastWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pastWorkouts.map(renderWorkoutCard)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No past workouts found. Start your fitness journey today!
          </p>
        )}
      </section>
    </div>
  );
};

export default WorkoutPage;
