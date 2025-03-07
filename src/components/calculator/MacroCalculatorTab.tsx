
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';

export default function MacroCalculatorTab() {
  const { dispatch } = useCalculator();
  
  const handleContinue = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 3 });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Macro Calculator</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Macro Distribution</CardTitle>
          <CardDescription>
            Calculate your ideal macronutrient distribution based on your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under development. It will allow you to calculate your ideal macronutrient distribution 
            based on your TDEE and body composition goals.
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleContinue}>
          Continue to Goals
        </Button>
      </div>
    </div>
  );
}
