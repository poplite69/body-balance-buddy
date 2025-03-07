
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { useCalculator } from '@/context/CalculatorContext';

export default function DisclaimerTab() {
  const { dispatch } = useCalculator();
  
  const handleContinue = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 1 });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
          <CardDescription>
            Please read the following information before using the calculator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Educational Tool Only</AlertTitle>
            <AlertDescription>
              This calculator is provided for educational and informational purposes only. It is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or health condition.
            </AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Not Medical Advice</AlertTitle>
            <AlertDescription>
              The information provided by this calculator is not medical advice. Consult with a healthcare professional before making significant changes to your diet or exercise routine, especially if you have pre-existing health conditions.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Calculator Limitations</h3>
            <p>
              The TDEE/BMR calculator provides estimates based on statistical models and formulas. Individual metabolism can vary significantly based on factors not accounted for in these calculations, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Genetic factors</li>
              <li>Hormonal conditions</li>
              <li>Medical conditions</li>
              <li>Medication effects</li>
              <li>Precise body composition</li>
              <li>Individual metabolic adaptations</li>
            </ul>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Health and Safety Guidelines</h3>
            
            <div>
              <h4 className="font-medium">Caloric Minimums</h4>
              <p className="text-sm text-muted-foreground">
                Avoid extremely low-calorie diets (under 1200 calories for women or 1500 calories for men) without medical supervision. The calculator will suggest minimum safe calorie intakes based on your metrics.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Rate of Weight Change</h4>
              <p className="text-sm text-muted-foreground">
                Healthy and sustainable weight loss generally occurs at a rate of 0.5-1kg (1-2lbs) per week. Rapid weight loss may lead to muscle loss, nutritional deficiencies, and metabolic adaptation.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Special Populations</h4>
              <p className="text-sm text-muted-foreground">
                This calculator may not be suitable for pregnant or breastfeeding women, individuals under 18, those with eating disorders, or those with certain medical conditions. These groups should consult healthcare professionals for appropriate guidance.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Usage Agreement</h3>
            <p className="text-sm">
              By using this calculator, you acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>You understand the calculator provides estimates only</li>
              <li>You will use the information responsibly</li>
              <li>You will consult healthcare professionals before making significant dietary or exercise changes</li>
              <li>You assume responsibility for how you use this information</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleContinue}>
          I Understand - Continue to Calculator
        </Button>
      </div>
    </div>
  );
}
