
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkoutTracker } from "@/components/workout/WorkoutTracker";
import { useEffect, useState } from "react";

const WorkoutPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced lifecycle logging
  useEffect(() => {
    console.log("WorkoutPage mounted with enhanced logging");
    // Mark as loaded after initial render
    setIsLoaded(true);
    
    return () => {
      console.log("WorkoutPage unmounted with enhanced logging");
    };
  }, []);

  console.log("WorkoutPage rendering, isLoaded:", isLoaded);

  return (
    <AppLayout>
      {isLoaded && <WorkoutTracker />}
    </AppLayout>
  );
};

export default WorkoutPage;
