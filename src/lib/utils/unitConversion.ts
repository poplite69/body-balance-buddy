
/**
 * Unit conversion utilities
 */

// Weight conversions
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

// Height conversions
export function cmToFeet(cm: number): number {
  return cm / 30.48;
}

export function feetToCm(feet: number): number {
  return feet * 30.48;
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function ftInToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

// Format height for display
export function formatHeight(cm: number, units: 'metric' | 'imperial'): string {
  if (units === 'metric') {
    return `${cm} cm`;
  } else {
    const { feet, inches } = cmToFtIn(cm);
    return `${feet}'${inches}"`;
  }
}

// Format weight for display
export function formatWeight(kg: number, units: 'metric' | 'imperial'): string {
  if (units === 'metric') {
    return `${kg.toFixed(1)} kg`;
  } else {
    return `${kgToLbs(kg).toFixed(1)} lbs`;
  }
}
