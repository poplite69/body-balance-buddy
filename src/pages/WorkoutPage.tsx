
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkoutTracker } from "@/components/workout/WorkoutTracker";
import { useState } from "react";

const WorkoutPage = () => {
  console.log("WorkoutPage rendering");
  
  return (
    <AppLayout>
      <WorkoutTracker />
    </AppLayout>
  );
};

export default WorkoutPage;
