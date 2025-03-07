
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCalculator } from './CalculatorContext';
import { addWeeks, format } from 'date-fns';

interface ProjectionDataPoint {
  week: number;
  date: string;
  weight: number;
  lbm: number;
  fatMass: number;
  bodyFat: number;
  tdee: number;
  calories: number;
}

interface GoalsContextType {
  goalType: 'lose' | 'maintain' | 'gain';
  setGoalType: (value: 'lose' | 'maintain' | 'gain') => void;
  targetWeight: number;
  setTargetWeight: (value: number) => void;
  timeframe: number;
  setTimeframe: (value: number) => void;
  fatLossPercent: number;
  setFatLossPercent: (value: number) => void;
  dailyDeficit: number;
  setDailyDeficit: (value: number) => void;
  isLoading: boolean;
  projectionData: ProjectionDataPoint[];
  getChangeColor: (value: number) => string;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { state } = useCalculator();
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
  const [projectionData, setProjectionData] = useState<ProjectionDataPoint[]>([]);
  
  // Get color based on value change
  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };
  
  // Calculate projections when inputs change
  useEffect(() => {
    if (tdee > 0) {
      setIsLoading(true);
      
      setTimeout(() => {
        const weightDifference = targetWeight - weight;
        const weeklyData: ProjectionDataPoint[] = [];
        
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
  
  return (
    <GoalsContext.Provider value={{
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
      isLoading,
      projectionData,
      getChangeColor,
    }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}

// Export the ProjectionDataPoint type for use in components
export type { ProjectionDataPoint };
