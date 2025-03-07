
import React from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import Calculator from '@/components/calculator/Calculator';

export default function CalculatorPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">TDEE/BMR Calculator</h1>
      <CalculatorProvider>
        <Calculator />
      </CalculatorProvider>
    </div>
  );
}
