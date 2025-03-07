
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { calculateBMR, calculateTDEE } from '@/lib/calculations/metabolic';

// Types
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extremelyActive';
export type BMRFormula = 'mifflinStJeor' | 'harrisBenedict' | 'katchMcArdle' | 'schofield';
export type Units = 'metric' | 'imperial';

export interface UserMetrics {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  bodyFat?: number;
  waist?: number;
  neck?: number;
  hip?: number;
  units: Units;
}

export interface CalculationSettings {
  bmrFormula: BMRFormula;
  activityLevel: ActivityLevel;
  customBMR?: number;
  customTDEE?: number;
}

export interface CalculationResults {
  bmr: number;
  tdee: number;
  lbm?: number;
  fatMass?: number;
  bmi?: number;
  idealWeight?: number;
  maxFatLoss?: number;
  minCalories?: number;
}

export interface CalculatorState {
  activeTab: number;
  userMetrics: UserMetrics;
  calculationSettings: CalculationSettings;
  calculationResults: CalculationResults;
}

// Default state
const defaultState: CalculatorState = {
  activeTab: 0,
  userMetrics: {
    weight: 70, // kg
    height: 170, // cm
    age: 30,
    gender: 'male',
    units: 'metric'
  },
  calculationSettings: {
    bmrFormula: 'mifflinStJeor',
    activityLevel: 'moderatelyActive'
  },
  calculationResults: {
    bmr: 0,
    tdee: 0
  }
};

// Actions
type CalculatorAction = 
  | { type: 'SET_ACTIVE_TAB'; payload: number }
  | { type: 'UPDATE_USER_METRICS'; payload: Partial<UserMetrics> }
  | { type: 'UPDATE_CALCULATION_SETTINGS'; payload: Partial<CalculationSettings> }
  | { type: 'CALCULATE_RESULTS' };

// Reducer
function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
      
    case 'UPDATE_USER_METRICS':
      return { 
        ...state, 
        userMetrics: { ...state.userMetrics, ...action.payload }
      };
      
    case 'UPDATE_CALCULATION_SETTINGS':
      return { 
        ...state, 
        calculationSettings: { ...state.calculationSettings, ...action.payload }
      };
      
    case 'CALCULATE_RESULTS': {
      const { userMetrics, calculationSettings } = state;
      const { weight, height, age, gender, bodyFat } = userMetrics;
      const { bmrFormula, activityLevel, customBMR, customTDEE } = calculationSettings;
      
      // Calculate BMR
      let bmr = customBMR || calculateBMR({
        weight,
        height,
        age,
        gender,
        bodyFat,
        formula: bmrFormula
      });
      
      // Calculate TDEE
      let tdee = customTDEE || calculateTDEE(bmr, activityLevel);
      
      // Additional calculations would be here
      
      return {
        ...state,
        calculationResults: {
          ...state.calculationResults,
          bmr,
          tdee
        }
      };
    }
      
    default:
      return state;
  }
}

// Context
type CalculatorContextType = {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// Provider
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, defaultState);
  
  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

// Hook
export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
