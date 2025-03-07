
import { BMRFormula, Gender, ActivityLevel } from '@/context/CalculatorContext';

type BMRParams = {
  weight: number;  // kg
  height: number;  // cm
  age: number;
  gender: Gender;
  bodyFat?: number; // percentage
  formula: BMRFormula;
};

// Activity multipliers for TDEE calculation
const activityMultipliers: Record<ActivityLevel, number> = {
  'sedentary': 1.2,          // Little or no exercise
  'lightlyActive': 1.375,    // Light exercise 1-3 days/week
  'moderatelyActive': 1.55,  // Moderate exercise 3-5 days/week
  'veryActive': 1.725,       // Hard exercise 6-7 days a week
  'extremelyActive': 1.9     // Very hard exercise, physical job or 2x training
};

/**
 * Calculate BMR using various formulas
 */
export function calculateBMR(params: BMRParams): number {
  const { weight, height, age, gender, bodyFat, formula } = params;
  const isMale = gender === 'male';
  
  switch (formula) {
    case 'mifflinStJeor':
      return isMale 
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;
        
    case 'harrisBenedict':
      return isMale
        ? 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age)
        : 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        
    case 'katchMcArdle':
      if (bodyFat === undefined) {
        throw new Error('Body fat percentage is required for Katch-McArdle formula');
      }
      const lbm = weight * (1 - (bodyFat / 100));
      return 370 + (21.6 * lbm);
      
    case 'schofield':
      if (isMale) {
        if (age < 30) return 15.057 * weight + 692.2;
        if (age < 60) return 11.472 * weight + 873.1;
        return 11.711 * weight + 587.7;
      } else {
        if (age < 30) return 14.818 * weight + 486.6;
        if (age < 60) return 8.126 * weight + 845.6;
        return 9.082 * weight + 658.5;
      }
      
    default:
      return 0;
  }
}

/**
 * Calculate TDEE based on BMR and activity level
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * activityMultipliers[activityLevel];
}

/**
 * Calculate Lean Body Mass (LBM)
 */
export function calculateLBM(weight: number, bodyFatPercentage: number): number {
  return weight * (1 - (bodyFatPercentage / 100));
}

/**
 * Calculate Fat Mass
 */
export function calculateFatMass(weight: number, bodyFatPercentage: number): number {
  return weight * (bodyFatPercentage / 100);
}

/**
 * Calculate BMI (Body Mass Index)
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

/**
 * Get BMI Category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese (Class I)";
  if (bmi < 40) return "Obese (Class II)";
  return "Extreme Obesity (Class III)";
}

/**
 * Calculate Ideal Weight (based on BMI of 22)
 */
export function calculateIdealWeight(heightCm: number): number {
  const heightM = heightCm / 100;
  return 22 * (heightM * heightM);
}

/**
 * Calculate Maximum Fat Loss per day
 * Typically 31 calories per pound of body fat per day
 */
export function calculateMaxFatLoss(fatMass: number): number {
  return Math.round(fatMass * 31 * 2.2); // Converting kg to pounds (1kg ≈ 2.2lbs)
}

/**
 * Calculate Minimum Safe Daily Calories
 * 70% of BMR or TDEE - 1000, whichever is higher
 */
export function calculateMinCalories(bmr: number, tdee: number): number {
  return Math.max(bmr * 0.7, tdee - 1000);
}
