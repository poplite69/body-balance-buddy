
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkoutTracker } from "@/components/workout/WorkoutTracker";
import { useEffect, useState } from "react";

const WorkoutPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced lifecycle logging with immediate loading state
  useEffect(() => {
    console.log("WorkoutPage mounted with enhanced logging");
    
    // Set loaded state in the next tick to ensure proper rendering
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log("WorkoutPage setting isLoaded to true");
    }, 0);
    
    return () => {
      console.log("WorkoutPage unmounted with enhanced logging");
      clearTimeout(timer);
    };
  }, []);

  console.log("WorkoutPage rendering, isLoaded:", isLoaded);

  return (
    <AppLayout>
      {isLoaded ? (
        <WorkoutTracker />
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-grip-neutral-500">Loading workout tracker...</p>
        </div>
      )}
    </AppLayout>
  );
};

export default WorkoutPage;
