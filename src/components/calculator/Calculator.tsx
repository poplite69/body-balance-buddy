
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalculator } from '@/context/CalculatorContext';
import { GoalsProvider } from '@/context/GoalsContext';
import DisclaimerTab from './DisclaimerTab';
import BasicInfoTab from './BasicInfoTab';
import MacroCalculatorTab from './MacroCalculatorTab';
import GoalsTab from './GoalsTab';

export default function Calculator() {
  const { state, dispatch } = useCalculator();
  const { activeTab } = state;

  const tabValues = ['disclaimer', 'basic-info', 'macro-calculator', 'goals'];
  
  useEffect(() => {
    // Calculate results when required inputs change
    dispatch({ type: 'CALCULATE_RESULTS' });
  }, [state.userMetrics, state.calculationSettings, dispatch]);

  const handleTabChange = (value: string) => {
    const tabIndex = tabValues.indexOf(value);
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabIndex });
  };

  return (
    <div className="bg-background rounded-lg border shadow-sm">
      <Tabs
        defaultValue={tabValues[activeTab]}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="disclaimer">Disclaimer</TabsTrigger>
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="macro-calculator">Macro Calculator</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="disclaimer">
          <DisclaimerTab />
        </TabsContent>
        
        <TabsContent value="basic-info">
          <BasicInfoTab />
        </TabsContent>
        
        <TabsContent value="macro-calculator">
          <MacroCalculatorTab />
        </TabsContent>
        
        <TabsContent value="goals">
          <GoalsProvider>
            <GoalsTab />
          </GoalsProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
}
