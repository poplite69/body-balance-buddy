
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import GoalSettings from './goals/GoalSettings';
import ProjectionResults from './goals/ProjectionResults';
import { Button } from "@/components/ui/button";

export default function GoalsTab() {
  const { dispatch } = useCalculator();
  
  const handlePrevious = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 2 });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Weight Goals Projection</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <GoalSettings />
        
        {/* Results Panel */}
        <ProjectionResults />
      </div>
      
      <div className="mt-6 flex justify-start">
        <Button variant="outline" onClick={handlePrevious}>
          Back to Macro Calculator
        </Button>
      </div>
    </div>
  );
}
