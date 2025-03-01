
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkoutTracker } from "@/components/workout/WorkoutTracker";
import { useEffect } from "react";

const WorkoutPage = () => {
  // Add lifecycle logging
  useEffect(() => {
    console.log("WorkoutPage mounted");
    return () => {
      console.log("WorkoutPage unmounted");
    };
  }, []);

  console.log("WorkoutPage rendering");

  return (
    <AppLayout>
      <WorkoutTracker />
    </AppLayout>
  );
};

export default WorkoutPage;
