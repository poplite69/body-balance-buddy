
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkoutTracker } from "@/components/workout/WorkoutTracker";
import { useEffect } from "react";

const WorkoutPage = () => {
  useEffect(() => {
    console.log("WorkoutPage mounted - component is in the DOM");
    
    return () => {
      console.log("WorkoutPage unmounted - component is removed from the DOM");
    };
  }, []);

  console.log("WorkoutPage rendering - before return statement");
  
  return (
    <AppLayout>
      <div className="workout-page-container">
        <WorkoutTracker />
      </div>
    </AppLayout>
  );
};

export default WorkoutPage;
