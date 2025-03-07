
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';

export default function GoalsTab() {
  const { dispatch } = useCalculator();
  
  const handleGoBack = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 0 });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Goals & Projections</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Weight Goals</CardTitle>
          <CardDescription>
            Set your weight change goals and view projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under development. It will allow you to set weight loss or gain goals 
            and provide projections based on your metabolic rate and macro settings.
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={handleGoBack} className="mr-2">
          Start Over
        </Button>
        <Button>
          Save Results
        </Button>
      </div>
    </div>
  );
}
