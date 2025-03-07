import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalculator } from '@/context/CalculatorContext';
import { 
  calculateBMI, 
  getBMICategory, 
  calculateLBM, 
  calculateFatMass,
  calculateIdealWeight,
  calculateMaxFatLoss,
  calculateMinCalories
} from '@/lib/calculations/metabolic';
import { formatHeight, formatWeight, ftInToCm } from '@/lib/utils/unitConversion';

export default function BasicInfoTab() {
  const { state, dispatch } = useCalculator();
  const { userMetrics, calculationSettings, calculationResults } = state;
  const [feetPart, setFeetPart] = useState(5);
  const [inchesPart, setInchesPart] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Calculate additional metrics
  useEffect(() => {
    if (calculationResults.bmr > 0) {
      setIsLoading(true);
      
      // Simulate calculation delay
      setTimeout(() => {
        const { weight, height, bodyFat } = userMetrics;
        const { bmr, tdee } = calculationResults;
        
        // Calculate derived metrics
        const bmi = calculateBMI(weight, height);
        const results = {
          bmi,
          idealWeight: calculateIdealWeight(height)
        };
        
        // Add body composition metrics if body fat is provided
        if (bodyFat !== undefined) {
          const lbm = calculateLBM(weight, bodyFat);
          const fatMass = calculateFatMass(weight, bodyFat);
          const maxFatLoss = calculateMaxFatLoss(fatMass);
          
          // Update results object with these values
          Object.assign(results, { lbm, fatMass, maxFatLoss });
        }
        
        // Add minimum calories
        const minCalories = calculateMinCalories(bmr, tdee);
        Object.assign(results, { minCalories });
        
        // Update calculation results directly
        dispatch({ 
          type: 'UPDATE_CALCULATION_RESULTS', 
          payload: results
        });
        
        setIsLoading(false);
      }, 300);
    }
  }, [calculationResults.bmr, calculationResults.tdee, userMetrics, dispatch]);
  
  // Handle imperial height changes
  useEffect(() => {
    if (userMetrics.units === 'imperial') {
      const heightInCm = ftInToCm(feetPart, inchesPart);
      if (heightInCm !== userMetrics.height) {
        dispatch({ 
          type: 'UPDATE_USER_METRICS', 
          payload: { height: heightInCm } 
        });
      }
    }
  }, [feetPart, inchesPart, userMetrics.units, dispatch]);
  
  
  const handleGenderChange = (value: string) => {
    dispatch({
      type: 'UPDATE_USER_METRICS',
      payload: { gender: value as 'male' | 'female' }
    });
  };
  
  const handleMetricChange = (
    field: keyof typeof userMetrics,
    value: string | number | boolean
  ) => {
    dispatch({
      type: 'UPDATE_USER_METRICS',
      payload: { [field]: typeof value === 'string' ? parseFloat(value) || 0 : value }
    });
  };
  
  const handleFormulaChange = (value: string) => {
    dispatch({
      type: 'UPDATE_CALCULATION_SETTINGS',
      payload: { bmrFormula: value as 'mifflinStJeor' | 'harrisBenedict' | 'katchMcArdle' | 'schofield' }
    });
  };
  
  const handleActivityChange = (value: string) => {
    dispatch({
      type: 'UPDATE_CALCULATION_SETTINGS',
      payload: { activityLevel: value as 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extremelyActive' }
    });
  };
  
  const handleContinue = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 2 });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              Enter your measurements to calculate your metabolic rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Units Selection */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="units">Units</Label>
              <Tabs 
                defaultValue={userMetrics.units} 
                className="w-[200px]"
                onValueChange={(value) => handleMetricChange('units', value as 'metric' | 'imperial')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Gender Selection */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup 
                defaultValue={userMetrics.gender} 
                onValueChange={handleGenderChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                value={userMetrics.age || ''} 
                onChange={(e) => handleMetricChange('age', e.target.value)}
                min={18}
                max={100}
              />
            </div>
            
            {/* Height Input */}
            {userMetrics.units === 'metric' ? (
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  value={userMetrics.height || ''} 
                  onChange={(e) => handleMetricChange('height', e.target.value)}
                  min={100}
                  max={250}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Height (ft & in)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="feet">Feet</Label>
                    <Input 
                      id="feet" 
                      type="number" 
                      value={feetPart || ''} 
                      onChange={(e) => setFeetPart(parseInt(e.target.value) || 0)}
                      min={4}
                      max={7}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inches">Inches</Label>
                    <Input 
                      id="inches" 
                      type="number" 
                      value={inchesPart || ''} 
                      onChange={(e) => setInchesPart(parseInt(e.target.value) || 0)}
                      min={0}
                      max={11}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Weight Input */}
            <div className="space-y-2">
              <Label htmlFor="weight">
                Weight ({userMetrics.units === 'metric' ? 'kg' : 'lbs'})
              </Label>
              <Input 
                id="weight" 
                type="number" 
                value={userMetrics.weight || ''} 
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  const weightInKg = userMetrics.units === 'metric' 
                    ? value 
                    : value / 2.20462;
                  handleMetricChange('weight', weightInKg);
                }}
                min={30}
                max={300}
              />
            </div>
            
            {/* Body Fat Input */}
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
              <Input 
                id="bodyFat" 
                type="number" 
                value={userMetrics.bodyFat || ''} 
                onChange={(e) => handleMetricChange('bodyFat', e.target.value)}
                min={5}
                max={50}
              />
            </div>
            
            {/* Advanced Toggle */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="advanced-mode" 
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
              <Label htmlFor="advanced-mode">Show Advanced Options</Label>
            </div>
            
            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 pt-2">
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="bmrFormula">BMR Calculation Formula</Label>
                  <Select 
                    value={calculationSettings.bmrFormula} 
                    onValueChange={handleFormulaChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select formula" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mifflinStJeor">Mifflin-St Jeor</SelectItem>
                      <SelectItem value="harrisBenedict">Harris-Benedict</SelectItem>
                      <SelectItem value="katchMcArdle">Katch-McArdle</SelectItem>
                      <SelectItem value="schofield">Schofield</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select 
                    value={calculationSettings.activityLevel} 
                    onValueChange={handleActivityChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="lightlyActive">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderatelyActive">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="veryActive">Very Active (hard exercise 6-7 days a week)</SelectItem>
                      <SelectItem value="extremelyActive">Extremely Active (very intense exercise, physical job or 2x training)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>
              Metabolic rate and body composition metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Basal Metabolic Rate (BMR)</Label>
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <div className="text-2xl font-bold">{Math.round(calculationResults.bmr)} calories</div>
                )}
                <p className="text-xs text-muted-foreground">Calories burned at complete rest</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Total Daily Energy Expenditure (TDEE)</Label>
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <div className="text-2xl font-bold">{Math.round(calculationResults.tdee)} calories</div>
                )}
                <p className="text-xs text-muted-foreground">Daily calorie needs with activity</p>
              </div>
            </div>
            
            <Separator />
            
            {/* Body Composition */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Body Composition</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Weight</Label>
                  {isLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <div className="font-medium">{formatWeight(userMetrics.weight, userMetrics.units)}</div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Height</Label>
                  {isLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <div className="font-medium">{formatHeight(userMetrics.height, userMetrics.units)}</div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">BMI</Label>
                  {isLoading || !calculationResults.bmi ? (
                    <Skeleton className="h-6 w-full" />
                  ) : (
                    <div className="font-medium">
                      {calculationResults.bmi.toFixed(1)} ({getBMICategory(calculationResults.bmi)})
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Ideal Weight</Label>
                  {isLoading || !calculationResults.idealWeight ? (
                    <Skeleton className="h-6 w-full" />
                  ) : (
                    <div className="font-medium">
                      {formatWeight(calculationResults.idealWeight, userMetrics.units)}
                    </div>
                  )}
                </div>
              </div>
              
              {userMetrics.bodyFat && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Lean Body Mass</Label>
                    {isLoading || !calculationResults.lbm ? (
                      <Skeleton className="h-6 w-full" />
                    ) : (
                      <div className="font-medium">
                        {formatWeight(calculationResults.lbm, userMetrics.units)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Fat Mass</Label>
                    {isLoading || !calculationResults.fatMass ? (
                      <Skeleton className="h-6 w-full" />
                    ) : (
                      <div className="font-medium">
                        {formatWeight(calculationResults.fatMass, userMetrics.units)} ({userMetrics.bodyFat}%)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Nutritional Guidelines */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nutritional Guidelines</h3>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Minimum Recommended Calories</Label>
                {isLoading || !calculationResults.minCalories ? (
                  <Skeleton className="h-6 w-full" />
                ) : (
                  <div className="font-medium">
                    {Math.round(calculationResults.minCalories)} calories per day
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Avoid going below this to maintain proper metabolic function
                </p>
              </div>
              
              {userMetrics.bodyFat && calculationResults.maxFatLoss && (
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Maximum Fat Metabolism</Label>
                  {isLoading ? (
                    <Skeleton className="h-6 w-full" />
                  ) : (
                    <div className="font-medium">
                      {Math.round(calculationResults.maxFatLoss)} calories per day
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Theoretical maximum calories that can come from fat stores
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleContinue}>
          Continue to Macro Calculator
        </Button>
      </div>
    </div>
  );
}
