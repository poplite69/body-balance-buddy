
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCalculator } from '@/context/CalculatorContext';
import { useGoals } from '@/context/GoalsContext';
import { formatWeight } from '@/lib/utils/unitConversion';

export default function GoalSettings() {
  const { state } = useCalculator();
  const { userMetrics, calculationResults } = state;
  const { weight, bodyFat, units } = userMetrics;
  const { tdee } = calculationResults;
  
  const {
    goalType,
    setGoalType,
    targetWeight,
    setTargetWeight,
    timeframe,
    setTimeframe,
    fatLossPercent,
    setFatLossPercent,
    dailyDeficit,
    setDailyDeficit,
    projectionData,
    getChangeColor
  } = useGoals();
  
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Goal Settings</CardTitle>
        <CardDescription>
          Set your weight target and timeframe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal Type */}
        <div className="space-y-2">
          <Label>Goal Type</Label>
          <RadioGroup 
            defaultValue={goalType} 
            onValueChange={(value) => setGoalType(value as 'lose' | 'maintain' | 'gain')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lose" id="lose" />
              <Label htmlFor="lose">Lose Weight</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maintain" id="maintain" />
              <Label htmlFor="maintain">Maintain</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gain" id="gain" />
              <Label htmlFor="gain">Gain Weight</Label>
            </div>
          </RadioGroup>
        </div>
        
        {goalType !== 'maintain' && (
          <div className="space-y-2">
            <Label htmlFor="target-weight">Target Weight ({units === 'metric' ? 'kg' : 'lbs'})</Label>
            <Input 
              id="target-weight" 
              type="number" 
              value={units === 'metric' ? targetWeight : Math.round(targetWeight * 2.20462)} 
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setTargetWeight(units === 'metric' ? value : value / 2.20462);
              }}
              min={units === 'metric' ? 40 : 88}
              max={units === 'metric' ? 200 : 440}
              step={units === 'metric' ? 0.5 : 1}
            />
            <p className="text-xs text-muted-foreground">
              {goalType === 'lose' ? 'Weight to lose' : 'Weight to gain'}: {' '}
              {Math.abs(targetWeight - weight).toFixed(1)} kg
              {units === 'imperial' && ` (${Math.abs((targetWeight - weight) * 2.20462).toFixed(1)} lbs)`}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe (weeks)</Label>
          <Input 
            id="timeframe" 
            type="number" 
            value={timeframe} 
            onChange={(e) => setTimeframe(parseInt(e.target.value) || 12)}
            min={1}
            max={52}
          />
          <p className="text-xs text-muted-foreground">
            Approximately {Math.round(timeframe / 4)} months
          </p>
        </div>
        
        {goalType !== 'maintain' && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="daily-deficit">
                Daily {goalType === 'lose' ? 'Deficit' : 'Surplus'} (calories)
              </Label>
              <span className="text-sm text-muted-foreground">
                {Math.abs(dailyDeficit)} calories
              </span>
            </div>
            <Slider
              id="daily-deficit"
              value={[Math.abs(dailyDeficit)]}
              min={100}
              max={1000}
              step={50}
              onValueChange={(value) => {
                // Fix the type error by properly handling the value
                const numericValue = value[0];
                setDailyDeficit(goalType === 'lose' ? -numericValue : numericValue);
              }}
            />
            <p className="text-xs text-muted-foreground">
              {goalType === 'lose' ? 'Deficit' : 'Surplus'} of {Math.abs(dailyDeficit * 7).toLocaleString()} calories per week
            </p>
          </div>
        )}
        
        {goalType === 'lose' && bodyFat && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fat-loss-percent">Fat Loss Percentage</Label>
              <span className="text-sm text-muted-foreground">{fatLossPercent}%</span>
            </div>
            <Slider
              id="fat-loss-percent"
              value={[fatLossPercent]}
              min={60}
              max={95}
              step={5}
              onValueChange={(value) => {
                // Fix the type error by properly handling the value
                const numericValue = value[0];
                setFatLossPercent(numericValue);
              }}
            />
            <p className="text-xs text-muted-foreground">
              {fatLossPercent}% from fat, {100 - fatLossPercent}% from muscle
            </p>
          </div>
        )}
        
        <Separator />
        
        <GoalSummary />
      </CardContent>
    </Card>
  );
}

// GoalSummary sub-component for better organization
function GoalSummary() {
  const { state } = useCalculator();
  const { userMetrics, calculationResults } = state;
  const { weight, bodyFat, units } = userMetrics;
  const { tdee } = calculationResults;
  
  const {
    goalType,
    targetWeight,
    dailyDeficit,
    projectionData,
    getChangeColor
  } = useGoals();
  
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Summary</h3>
      
      <div className="bg-secondary p-4 rounded-md space-y-2">
        <div className="grid grid-cols-2 gap-y-1">
          <div className="text-sm">Current Weight:</div>
          <div className="text-sm font-medium text-right">
            {formatWeight(weight, units)}
          </div>
          
          {goalType !== 'maintain' && (
            <>
              <div className="text-sm">Target Weight:</div>
              <div className="text-sm font-medium text-right">
                {formatWeight(targetWeight, units)}
              </div>
            </>
          )}
          
          <div className="text-sm">Daily Calories:</div>
          <div className="text-sm font-medium text-right">
            {Math.round(tdee + dailyDeficit)} calories
          </div>
          
          {goalType !== 'maintain' && (
            <>
              <div className="text-sm">Weekly Change:</div>
              <div className={`text-sm font-medium text-right ${getChangeColor(dailyDeficit * 7 / 7700)}`}>
                {(dailyDeficit * 7 / 7700).toFixed(2)} kg
              </div>
            </>
          )}
          
          {bodyFat && (
            <>
              <div className="text-sm">Current Body Fat:</div>
              <div className="text-sm font-medium text-right">
                {bodyFat.toFixed(1)}%
              </div>
            </>
          )}
          
          {projectionData.length > 0 && (
            <>
              <div className="text-sm">End Date:</div>
              <div className="text-sm font-medium text-right">
                {projectionData[projectionData.length - 1].date}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
