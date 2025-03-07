
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalculator } from '@/context/CalculatorContext';
import { formatWeight } from '@/lib/utils/unitConversion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addWeeks, format } from 'date-fns';

export default function GoalsTab() {
  const { state, dispatch } = useCalculator();
  const { userMetrics, calculationResults } = state;
  const { weight, bodyFat, units } = userMetrics;
  const { tdee, bmr, lbm, fatMass } = calculationResults;
  
  // Goal settings
  const [goalType, setGoalType] = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [targetWeight, setTargetWeight] = useState(weight * 0.9); // Default to 10% loss
  const [timeframe, setTimeframe] = useState(12); // Weeks
  const [fatLossPercent, setFatLossPercent] = useState(85); // % of weight loss from fat
  const [dailyDeficit, setDailyDeficit] = useState(-500); // Calories per day
  
  // Projection data
  const [isLoading, setIsLoading] = useState(false);
  const [projectionData, setProjectionData] = useState<any[]>([]);
  
  // Calculate projections when inputs change
  useEffect(() => {
    if (tdee > 0) {
      setIsLoading(true);
      
      setTimeout(() => {
        const weightDifference = targetWeight - weight;
        const weeklyData = [];
        
        // Calculate daily calorie change based on goal
        let dailyCalorieChange = dailyDeficit;
        if (goalType === 'maintain') {
          dailyCalorieChange = 0;
        } else if (goalType === 'gain') {
          dailyCalorieChange = Math.abs(dailyDeficit);
        }
        
        // Calculate weekly calorie change
        const weeklyCalorieChange = dailyCalorieChange * 7;
        
        // Calculate weekly weight change (7700 calories ≈ 1kg)
        const weeklyWeightChange = weeklyCalorieChange / 7700;
        
        // Determine if goal is achievable in timeframe
        const totalWeightChangeNeeded = Math.abs(weightDifference);
        const totalWeightChangePossible = Math.abs(weeklyWeightChange * timeframe);
        
        const isAchievable = totalWeightChangePossible >= totalWeightChangeNeeded;
        
        // Current metrics
        let currentWeight = weight;
        let currentFatMass = fatMass || (weight * (bodyFat || 20) / 100);
        let currentLBM = lbm || (weight - currentFatMass);
        let currentBodyFat = bodyFat || 20;
        
        // Starting point (week 0)
        const startDate = new Date();
        weeklyData.push({
          week: 0,
          date: format(startDate, 'MMM d, yyyy'),
          weight: currentWeight,
          lbm: currentLBM,
          fatMass: currentFatMass,
          bodyFat: currentBodyFat,
          tdee: tdee,
          calories: tdee + dailyCalorieChange,
        });
        
        // Generate weekly projections
        for (let week = 1; week <= timeframe; week++) {
          // Calculate weight change this week
          const weightChangeThisWeek = weeklyWeightChange;
          
          // If losing weight, determine how much comes from fat vs. lean mass
          if (weightChangeThisWeek < 0) {
            const fatLoss = weightChangeThisWeek * (fatLossPercent / 100);
            const lbmLoss = weightChangeThisWeek - fatLoss;
            
            currentFatMass += fatLoss;
            currentLBM += lbmLoss;
          } else if (weightChangeThisWeek > 0) {
            // If gaining weight, assume 50% goes to muscle by default
            const muscleGain = weightChangeThisWeek * 0.5;
            const fatGain = weightChangeThisWeek - muscleGain;
            
            currentLBM += muscleGain;
            currentFatMass += fatGain;
          }
          
          // Update current weight and body fat percentage
          currentWeight = currentLBM + currentFatMass;
          currentBodyFat = (currentFatMass / currentWeight) * 100;
          
          // Calculate date for this week
          const date = addWeeks(startDate, week);
          
          // Add data point
          weeklyData.push({
            week,
            date: format(date, 'MMM d, yyyy'),
            weight: parseFloat(currentWeight.toFixed(1)),
            lbm: parseFloat(currentLBM.toFixed(1)),
            fatMass: parseFloat(currentFatMass.toFixed(1)),
            bodyFat: parseFloat(currentBodyFat.toFixed(1)),
            tdee: Math.round(tdee), // This could be recalculated based on new weight
            calories: Math.round(tdee + dailyCalorieChange),
          });
          
          // If we've reached or passed the target weight, we can stop
          if (goalType === 'lose' && currentWeight <= targetWeight) {
            break;
          } else if (goalType === 'gain' && currentWeight >= targetWeight) {
            break;
          }
        }
        
        setProjectionData(weeklyData);
        setIsLoading(false);
      }, 300);
    }
  }, [
    weight,
    targetWeight,
    timeframe,
    fatLossPercent,
    dailyDeficit,
    goalType,
    tdee,
    lbm,
    fatMass,
    bodyFat
  ]);
  
  // Get color based on value change
  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };
  
  const handlePrevious = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 2 });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Weight Goals Projection</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
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
                  onValueChange={(value) => setDailyDeficit(goalType === 'lose' ? -value[0] : value[0])}
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
                  onValueChange={(value) => setFatLossPercent(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  {fatLossPercent}% from fat, {100 - fatLossPercent}% from muscle
                </p>
              </div>
            )}
            
            <Separator />
            
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
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Projection Results</CardTitle>
            <CardDescription>
              Weekly breakdown of expected changes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Weight Projection Chart */}
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-md" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={projectionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis yAxisId="left" domain={['dataMin - 2', 'dataMax + 2']} label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} label={{ value: 'Body Fat %', angle: 90, position: 'insideRight' }} />
                    <Tooltip formatter={(value) => [parseFloat(value).toFixed(1), '']} />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="weight" 
                      name="Weight (kg)" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    {bodyFat && (
                      <>
                        <Line 
                          yAxisId="left" 
                          type="monotone" 
                          dataKey="lbm" 
                          name="Lean Mass (kg)" 
                          stroke="#82ca9d" 
                        />
                        <Line 
                          yAxisId="left" 
                          type="monotone" 
                          dataKey="fatMass" 
                          name="Fat Mass (kg)" 
                          stroke="#ffc658" 
                        />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="bodyFat" 
                          name="Body Fat %" 
                          stroke="#ff8042" 
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <Separator />
            
            {/* Projection Table */}
            <div className="overflow-auto max-h-[400px]">
              <Table>
                <TableCaption>Projected weight changes over {timeframe} weeks</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Weight</TableHead>
                    {bodyFat && (
                      <>
                        <TableHead>Body Fat</TableHead>
                        <TableHead>Lean Mass</TableHead>
                        <TableHead>Fat Mass</TableHead>
                      </>
                    )}
                    <TableHead>Daily Calories</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: bodyFat ? 7 : 4 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    projectionData.map((row) => (
                      <TableRow key={row.week}>
                        <TableCell>{row.week}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{formatWeight(row.weight, units)}</TableCell>
                        {bodyFat && (
                          <>
                            <TableCell>{row.bodyFat.toFixed(1)}%</TableCell>
                            <TableCell>{formatWeight(row.lbm, units)}</TableCell>
                            <TableCell>{formatWeight(row.fatMass, units)}</TableCell>
                          </>
                        )}
                        <TableCell>{row.calories} cal</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {!isLoading && projectionData.length > 1 && (
              <div className="bg-secondary p-4 rounded-md">
                <h3 className="text-md font-semibold mb-2">Final Results Summary</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Weight Change</div>
                    <div className={`text-lg font-semibold ${getChangeColor(projectionData[projectionData.length - 1].weight - projectionData[0].weight)}`}>
                      {(projectionData[projectionData.length - 1].weight - projectionData[0].weight > 0 ? '+' : '')}
                      {(projectionData[projectionData.length - 1].weight - projectionData[0].weight).toFixed(1)} kg
                    </div>
                  </div>
                  
                  {bodyFat && (
                    <>
                      <div>
                        <div className="text-sm text-muted-foreground">Body Fat Change</div>
                        <div className={`text-lg font-semibold ${getChangeColor(projectionData[projectionData.length - 1].bodyFat - projectionData[0].bodyFat)}`}>
                          {(projectionData[projectionData.length - 1].bodyFat - projectionData[0].bodyFat > 0 ? '+' : '')}
                          {(projectionData[projectionData.length - 1].bodyFat - projectionData[0].bodyFat).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Lean Mass Change</div>
                        <div className={`text-lg font-semibold ${getChangeColor(projectionData[projectionData.length - 1].lbm - projectionData[0].lbm)}`}>
                          {(projectionData[projectionData.length - 1].lbm - projectionData[0].lbm > 0 ? '+' : '')}
                          {(projectionData[projectionData.length - 1].lbm - projectionData[0].lbm).toFixed(1)} kg
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Fat Mass Change</div>
                        <div className={`text-lg font-semibold ${getChangeColor(projectionData[projectionData.length - 1].fatMass - projectionData[0].fatMass)}`}>
                          {(projectionData[projectionData.length - 1].fatMass - projectionData[0].fatMass > 0 ? '+' : '')}
                          {(projectionData[projectionData.length - 1].fatMass - projectionData[0].fatMass).toFixed(1)} kg
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center p-4">
              <Button variant="outline" disabled>
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-start">
        <Button variant="outline" onClick={handlePrevious}>
          Back to Macro Calculator
        </Button>
      </div>
    </div>
  );
}
