
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCalculator } from '@/context/CalculatorContext';

export default function DisclaimerTab() {
  const { dispatch } = useCalculator();
  
  const handleContinue = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 1 });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
      
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          <p>
            The TDEE/BMR Calculator is designed to provide estimates of your Basal Metabolic Rate (BMR), 
            Total Daily Energy Expenditure (TDEE), and related metrics. These calculations are based on 
            established formulas and are intended for informational purposes only.
          </p>
          
          <h3 className="text-lg font-semibold mt-4">Not Medical Advice</h3>
          <p>
            The information provided by this calculator is not intended to replace professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
            with any questions you may have regarding a medical condition or before beginning any new diet or 
            exercise regimen.
          </p>
          
          <h3 className="text-lg font-semibold mt-4">Calculation Accuracy</h3>
          <p>
            While we strive to provide accurate calculations, the results are estimates based on statistical models 
            and formulas. Individual metabolism can vary significantly based on factors not accounted for in these 
            calculations, such as genetics, medical conditions, and specific physiological characteristics.
          </p>
          
          <h3 className="text-lg font-semibold mt-4">Safe Usage Guidelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Do not use this calculator to plan extreme caloric deficits (below 70% of your BMR).</li>
            <li>Consult with a medical professional before implementing significant dietary changes.</li>
            <li>This calculator is not designed for use by individuals under 18 years of age, pregnant or nursing women, or those with eating disorders.</li>
            <li>The weight loss/gain projections are theoretical and may not reflect real-world results.</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-4">Privacy</h3>
          <p>
            All calculations are performed locally in your browser. We do not store or transmit your personal information. 
            However, if you choose to save your results, they will be stored in your browser's local storage.
          </p>
        </div>
      </ScrollArea>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleContinue}>
          I Understand - Continue
        </Button>
      </div>
    </div>
  );
}
