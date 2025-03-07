
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalculator } from '@/context/CalculatorContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatWeight } from '@/lib/utils/unitConversion';

// Macro presets
const MACRO_PRESETS = {
  balanced: {
    name: 'Balanced',
    description: 'Equal distribution of macros based on calories',
    proteinMethod: 'percent',
    proteinValue: 30,
    carbsRest: 40,
    fatRest: 30,
    carbsWorkout: 40,
    fatWorkout: 30
  },
  lowCarb: {
    name: 'Low Carb',
    description: 'Higher fat, lower carb approach',
    proteinMethod: 'percent',
    proteinValue: 30,
    carbsRest: 20,
    fatRest: 50,
    carbsWorkout: 30,
    fatWorkout: 40
  },
  highProtein: {
    name: 'High Protein',
    description: 'Emphasizes protein for muscle preservation/growth',
    proteinMethod: 'gPerKg',
    proteinValue: 2.2,
    carbsRest: 30,
    fatRest: 30,
    carbsWorkout: 40,
    fatWorkout: 20
  },
  custom: {
    name: 'Custom',
    description: 'Your own custom macro distribution',
    proteinMethod: 'gPerKg',
    proteinValue: 1.8,
    carbsRest: 35,
    fatRest: 35,
    carbsWorkout: 45,
    fatWorkout: 25
  }
};

// Protein calculation methods
const PROTEIN_METHODS = [
  { value: 'gPerKg', label: 'g/kg of bodyweight' },
  { value: 'gPerLb', label: 'g/lb of bodyweight' },
  { value: 'percent', label: '% of total calories' },
  { value: 'fixed', label: 'Fixed amount (g)' }
];

// Macro colors
const COLORS = {
  protein: '#e07c24', // Orange
  carbs: '#9bca3e',   // Green
  fat: '#4682b4'      // Blue
};

interface MacroResult {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface MacroData {
  rest: MacroResult;
  workout: MacroResult;
  cycleTotals: {
    calories: number;
    tdee: number;
    deficit: number;
    weightChange: number;
  };
}

export default function MacroCalculatorTab() {
  const { state, dispatch } = useCalculator();
  const { userMetrics, calculationResults } = state;
  const { tdee, bmr } = calculationResults;
  
  // Macro settings state
  const [preset, setPreset] = useState('balanced');
  const [proteinMethod, setProteinMethod] = useState(MACRO_PRESETS.balanced.proteinMethod);
  const [proteinValue, setProteinValue] = useState(MACRO_PRESETS.balanced.proteinValue);
  const [carbsRest, setCarbsRest] = useState(MACRO_PRESETS.balanced.carbsRest);
  const [fatRest, setFatRest] = useState(MACRO_PRESETS.balanced.fatRest);
  const [carbsWorkout, setCarbsWorkout] = useState(MACRO_PRESETS.balanced.carbsWorkout);
  const [fatWorkout, setFatWorkout] = useState(MACRO_PRESETS.balanced.fatWorkout);
  
  // Cycle settings
  const [daysPerCycle, setDaysPerCycle] = useState(7);
  const [workoutDays, setWorkoutDays] = useState(3);
  const [calorieOffset, setCalorieOffset] = useState(0);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculated macros
  const [macroData, setMacroData] = useState<MacroData>({
    rest: {
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0
    },
    workout: {
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0
    },
    cycleTotals: {
      calories: 0,
      tdee: 0,
      deficit: 0,
      weightChange: 0
    }
  });
  
  // Handle preset change
  const handlePresetChange = (value: string) => {
    setPreset(value);
    const selectedPreset = MACRO_PRESETS[value as keyof typeof MACRO_PRESETS];
    
    setProteinMethod(selectedPreset.proteinMethod);
    setProteinValue(selectedPreset.proteinValue);
    setCarbsRest(selectedPreset.carbsRest);
    setFatRest(selectedPreset.fatRest);
    setCarbsWorkout(selectedPreset.carbsWorkout);
    setFatWorkout(selectedPreset.fatWorkout);
  };
  
  // Calculate macros when inputs change
  useEffect(() => {
    if (tdee > 0) {
      setIsLoading(true);
      
      // Simulate calculation delay
      setTimeout(() => {
        const adjustedTDEE = tdee * (1 + (calorieOffset / 100));
        
        // Calculate protein grams based on selected method
        let proteinGrams = 0;
        switch (proteinMethod) {
          case 'gPerKg':
            proteinGrams = userMetrics.weight * proteinValue;
            break;
          case 'gPerLb':
            proteinGrams = (userMetrics.weight * 2.2) * proteinValue;
            break;
          case 'percent':
            proteinGrams = (adjustedTDEE * (proteinValue / 100)) / 4;
            break;
          case 'fixed':
            proteinGrams = proteinValue;
            break;
        }
        
        // Calculate macros for rest day
        const restDayProteinCals = proteinGrams * 4;
        const restDayRemainingCals = adjustedTDEE - restDayProteinCals;
        const restDayCarbCals = restDayRemainingCals * (carbsRest / 100);
        const restDayFatCals = restDayRemainingCals * (fatRest / 100);
        
        const restDayResult = {
          protein: proteinGrams,
          carbs: restDayCarbCals / 4, // 4 calories per gram
          fat: restDayFatCals / 9,    // 9 calories per gram
          calories: restDayProteinCals + restDayCarbCals + restDayFatCals
        };
        
        // Calculate macros for workout day
        const workoutDayProteinCals = proteinGrams * 4;
        const workoutDayRemainingCals = adjustedTDEE - workoutDayProteinCals;
        const workoutDayCarbCals = workoutDayRemainingCals * (carbsWorkout / 100);
        const workoutDayFatCals = workoutDayRemainingCals * (fatWorkout / 100);
        
        const workoutDayResult = {
          protein: proteinGrams,
          carbs: workoutDayCarbCals / 4,
          fat: workoutDayFatCals / 9,
          calories: workoutDayProteinCals + workoutDayCarbCals + workoutDayFatCals
        };
        
        // Calculate cycle totals
        const restDays = daysPerCycle - workoutDays;
        const cycleTotalCalories = (restDayResult.calories * restDays) + (workoutDayResult.calories * workoutDays);
        const cycleTotalTDEE = tdee * daysPerCycle;
        const cycleDeficit = cycleTotalCalories - cycleTotalTDEE;
        
        // Calculate weight change (approximately 7700 calories = 1kg of fat)
        const weightChange = cycleDeficit / 7700;
        
        setMacroData({
          rest: restDayResult,
          workout: workoutDayResult,
          cycleTotals: {
            calories: cycleTotalCalories,
            tdee: cycleTotalTDEE,
            deficit: cycleDeficit,
            weightChange: weightChange
          }
        });
        
        setIsLoading(false);
      }, 300);
    }
  }, [
    tdee, 
    calorieOffset, 
    proteinMethod, 
    proteinValue, 
    carbsRest, 
    fatRest, 
    carbsWorkout, 
    fatWorkout,
    daysPerCycle,
    workoutDays,
    userMetrics.weight
  ]);
  
  // Prepare data for pie charts
  const getChartData = (type: 'rest' | 'workout') => {
    const macros = type === 'rest' ? macroData.rest : macroData.workout;
    
    return [
      { name: 'Protein', value: macros.protein * 4, gram: Math.round(macros.protein) },
      { name: 'Carbs', value: macros.carbs * 4, gram: Math.round(macros.carbs) },
      { name: 'Fat', value: macros.fat * 9, gram: Math.round(macros.fat) }
    ];
  };
  
  const handleContinue = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 3 });
  };
  
  const handlePrevious = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 1 });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Macro Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Macro Settings</CardTitle>
            <CardDescription>
              Customize your macro distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Selection */}
            <div className="space-y-2">
              <Label htmlFor="macro-preset">Preset</Label>
              <Select 
                value={preset} 
                onValueChange={handlePresetChange}
              >
                <SelectTrigger id="macro-preset">
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="lowCarb">Low Carb</SelectItem>
                  <SelectItem value="highProtein">High Protein</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {MACRO_PRESETS[preset as keyof typeof MACRO_PRESETS].description}
              </p>
            </div>
            
            <Separator />
            
            {/* Protein Settings */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Protein</h3>
              
              <div className="space-y-2">
                <Label htmlFor="protein-method">Calculation Method</Label>
                <Select 
                  value={proteinMethod} 
                  onValueChange={setProteinMethod}
                >
                  <SelectTrigger id="protein-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROTEIN_METHODS.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="protein-value">
                  {proteinMethod === 'gPerKg' && 'Grams per kg'}
                  {proteinMethod === 'gPerLb' && 'Grams per lb'}
                  {proteinMethod === 'percent' && 'Percentage of calories'}
                  {proteinMethod === 'fixed' && 'Fixed amount (g)'}
                </Label>
                <Input 
                  id="protein-value" 
                  type="number" 
                  value={proteinValue} 
                  onChange={(e) => setProteinValue(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={proteinMethod === 'percent' ? 100 : 500}
                  step={0.1}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Carbs and Fat Distribution */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Carbs & Fat Distribution</h3>
              
              <Tabs defaultValue="rest" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="rest">Rest Days</TabsTrigger>
                  <TabsTrigger value="workout">Workout Days</TabsTrigger>
                </TabsList>
                
                <TabsContent value="rest" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="carbs-rest">Carbs: {carbsRest}%</Label>
                        <span className="text-sm text-muted-foreground">
                          {!isLoading && Math.round(macroData.rest.carbs)}g
                        </span>
                      </div>
                      <Slider
                        id="carbs-rest"
                        value={[carbsRest]}
                        min={0}
                        max={100 - fatRest}
                        step={5}
                        onValueChange={(value) => setCarbsRest(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="fat-rest">Fat: {fatRest}%</Label>
                        <span className="text-sm text-muted-foreground">
                          {!isLoading && Math.round(macroData.rest.fat)}g
                        </span>
                      </div>
                      <Slider
                        id="fat-rest"
                        value={[fatRest]}
                        min={0}
                        max={100 - carbsRest}
                        step={5}
                        onValueChange={(value) => setFatRest(value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="workout" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="carbs-workout">Carbs: {carbsWorkout}%</Label>
                        <span className="text-sm text-muted-foreground">
                          {!isLoading && Math.round(macroData.workout.carbs)}g
                        </span>
                      </div>
                      <Slider
                        id="carbs-workout"
                        value={[carbsWorkout]}
                        min={0}
                        max={100 - fatWorkout}
                        step={5}
                        onValueChange={(value) => setCarbsWorkout(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="fat-workout">Fat: {fatWorkout}%</Label>
                        <span className="text-sm text-muted-foreground">
                          {!isLoading && Math.round(macroData.workout.fat)}g
                        </span>
                      </div>
                      <Slider
                        id="fat-workout"
                        value={[fatWorkout]}
                        min={0}
                        max={100 - carbsWorkout}
                        step={5}
                        onValueChange={(value) => setFatWorkout(value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <Separator />
            
            {/* Cycle Settings */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Cycle Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="days-per-cycle">Days per Cycle</Label>
                <Input 
                  id="days-per-cycle" 
                  type="number" 
                  value={daysPerCycle} 
                  onChange={(e) => setDaysPerCycle(parseInt(e.target.value) || 7)}
                  min={1}
                  max={28}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workout-days">Workout Days per Cycle</Label>
                <Input 
                  id="workout-days" 
                  type="number" 
                  value={workoutDays} 
                  onChange={(e) => setWorkoutDays(parseInt(e.target.value) || 0)}
                  min={0}
                  max={daysPerCycle}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="calorie-offset">Calorie Adjustment: {calorieOffset}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {!isLoading && Math.round(tdee * (calorieOffset / 100))} calories
                  </span>
                </div>
                <Slider
                  id="calorie-offset"
                  value={[calorieOffset]}
                  min={-45}
                  max={45}
                  step={5}
                  onValueChange={(value) => setCalorieOffset(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  {calorieOffset < 0 ? 'Deficit' : calorieOffset > 0 ? 'Surplus' : 'Maintenance'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Macro Results</CardTitle>
            <CardDescription>
              Your personalized macro breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rest Day Macros */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Rest Day</h3>
                
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full rounded-md" />
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getChartData('rest')}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, gram }) => `${name}: ${gram}g`}
                          labelLine={false}
                        >
                          <Cell key="protein" fill={COLORS.protein} />
                          <Cell key="carbs" fill={COLORS.carbs} />
                          <Cell key="fat" fill={COLORS.fat} />
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${Math.round(value)} calories`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton className="h-8 w-32 mx-auto" />
                    ) : (
                      Math.round(macroData.rest.calories)
                    )} calories
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {daysPerCycle - workoutDays} days per cycle
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.protein }}>Protein</div>
                    <div className="text-lg">
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        Math.round(macroData.rest.protein)
                      )}g
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? '' : Math.round((macroData.rest.protein * 4 / macroData.rest.calories) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.carbs }}>Carbs</div>
                    <div className="text-lg">
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        Math.round(macroData.rest.carbs)
                      )}g
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? '' : Math.round((macroData.rest.carbs * 4 / macroData.rest.calories) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.fat }}>Fat</div>
                    <div className="text-lg">
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        Math.round(macroData.rest.fat)
                      )}g
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? '' : Math.round((macroData.rest.fat * 9 / macroData.rest.calories) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Workout Day Macros */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Workout Day</h3>
                
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full rounded-md" />
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getChartData('workout')}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, gram }) => `${name}: ${gram}g`}
                          labelLine={false}
                        >
                          <Cell key="protein" fill={COLORS.protein} />
                          <Cell key="carbs" fill={COLORS.carbs} />
                          <Cell key="fat" fill={COLORS.fat} />
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${Math.round(value)} calories`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton className="h-8 w-32 mx-auto" />
                    ) : (
                      Math.round(macroData.workout.calories)
                    )} calories
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {workoutDays} days per cycle
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.protein }}>Protein</div>
                    <div className="text-lg">
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        Math.round(macroData.workout.protein)
                      )}g
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? '' : Math.round((macroData.workout.protein * 4 / macroData.workout.calories) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.carbs }}>Carbs</div>
                    <div className="text-lg">
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        Math.round(macroData.workout.carbs)
                      )}g
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? '' : Math.round((macroData.workout.carbs * 4 / macroData.workout.calories) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: COLORS.fat }}>Fat</div>
                    <div className="text-lg">
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        Math.round(macroData.workout.fat)
                      )}g
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? '' : Math.round((macroData.workout.fat * 9 / macroData.workout.calories) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Cycle Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cycle Summary</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1 text-center">
                  <Label className="text-sm text-muted-foreground">Cycle Length</Label>
                  <div className="font-medium">{daysPerCycle} days</div>
                  <div className="text-xs text-muted-foreground">
                    {workoutDays} workout, {daysPerCycle - workoutDays} rest
                  </div>
                </div>
                
                <div className="space-y-1 text-center">
                  <Label className="text-sm text-muted-foreground">Total Calories</Label>
                  {isLoading ? (
                    <Skeleton className="h-6 w-full" />
                  ) : (
                    <div className="font-medium">
                      {Math.round(macroData.cycleTotals.calories)} calories
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Per cycle
                  </div>
                </div>
                
                <div className="space-y-1 text-center">
                  <Label className="text-sm text-muted-foreground">Total TDEE</Label>
                  {isLoading ? (
                    <Skeleton className="h-6 w-full" />
                  ) : (
                    <div className="font-medium">
                      {Math.round(macroData.cycleTotals.tdee)} calories
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {Math.round(tdee)} per day
                  </div>
                </div>
                
                <div className="space-y-1 text-center">
                  <Label className="text-sm text-muted-foreground">
                    {macroData.cycleTotals.deficit < 0 ? 'Deficit' : 'Surplus'}
                  </Label>
                  {isLoading ? (
                    <Skeleton className="h-6 w-full" />
                  ) : (
                    <div className="font-medium">
                      {Math.abs(Math.round(macroData.cycleTotals.deficit))} calories
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {Math.abs(Math.round(macroData.cycleTotals.deficit / daysPerCycle))} per day
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary p-4 rounded-md text-center">
                <div className="text-sm text-muted-foreground mb-1">Estimated Weight Change</div>
                {isLoading ? (
                  <Skeleton className="h-8 w-32 mx-auto" />
                ) : (
                  <div className="text-xl font-bold">
                    {macroData.cycleTotals.weightChange > 0 ? '+' : ''}
                    {macroData.cycleTotals.weightChange.toFixed(2)} kg
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Per {daysPerCycle}-day cycle (~{(macroData.cycleTotals.weightChange * (30 / daysPerCycle)).toFixed(2)} kg per month)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          Back to Basic Info
        </Button>
        <Button onClick={handleContinue}>
          Continue to Goals
        </Button>
      </div>
    </div>
  );
}
