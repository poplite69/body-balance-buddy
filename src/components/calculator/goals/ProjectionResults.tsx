
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalculator } from '@/context/CalculatorContext';
import { useGoals, ProjectionDataPoint } from '@/context/GoalsContext';
import { formatWeight } from '@/lib/utils/unitConversion';
import { ProjectionChart } from './ProjectionChart';
import { ProjectionTable } from './ProjectionTable';

export default function ProjectionResults() {
  const { state } = useCalculator();
  const { userMetrics } = state;
  const { bodyFat, units } = userMetrics;
  
  const {
    isLoading,
    projectionData,
    getChangeColor
  } = useGoals();
  
  return (
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
            <ProjectionChart data={projectionData} showBodyFat={!!bodyFat} />
          )}
        </div>
        
        <Separator />
        
        {/* Projection Table */}
        <div className="overflow-auto max-h-[400px]">
          <ProjectionTable 
            isLoading={isLoading}
            projectionData={projectionData}
            showBodyFat={!!bodyFat}
            units={units}
          />
        </div>
        
        {!isLoading && projectionData.length > 1 && (
          <FinalResultsSummary 
            startData={projectionData[0]} 
            endData={projectionData[projectionData.length - 1]}
            showBodyFat={!!bodyFat}
            getChangeColor={getChangeColor}
          />
        )}
        
        <div className="flex items-center justify-center p-4">
          <Button variant="outline" disabled>
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface FinalResultsSummaryProps {
  startData: ProjectionDataPoint;
  endData: ProjectionDataPoint;
  showBodyFat: boolean;
  getChangeColor: (value: number) => string;
}

function FinalResultsSummary({
  startData,
  endData,
  showBodyFat,
  getChangeColor
}: FinalResultsSummaryProps) {
  return (
    <div className="bg-secondary p-4 rounded-md">
      <h3 className="text-md font-semibold mb-2">Final Results Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Total Weight Change</div>
          <div className={`text-lg font-semibold ${getChangeColor(endData.weight - startData.weight)}`}>
            {(endData.weight - startData.weight > 0 ? '+' : '')}
            {(endData.weight - startData.weight).toFixed(1)} kg
          </div>
        </div>
        
        {showBodyFat && (
          <>
            <div>
              <div className="text-sm text-muted-foreground">Body Fat Change</div>
              <div className={`text-lg font-semibold ${getChangeColor(endData.bodyFat - startData.bodyFat)}`}>
                {(endData.bodyFat - startData.bodyFat > 0 ? '+' : '')}
                {(endData.bodyFat - startData.bodyFat).toFixed(1)}%
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Lean Mass Change</div>
              <div className={`text-lg font-semibold ${getChangeColor(endData.lbm - startData.lbm)}`}>
                {(endData.lbm - startData.lbm > 0 ? '+' : '')}
                {(endData.lbm - startData.lbm).toFixed(1)} kg
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Fat Mass Change</div>
              <div className={`text-lg font-semibold ${getChangeColor(endData.fatMass - startData.fatMass)}`}>
                {(endData.fatMass - startData.fatMass > 0 ? '+' : '')}
                {(endData.fatMass - startData.fatMass).toFixed(1)} kg
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
