
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatWeight } from '@/lib/utils/unitConversion';
import { ProjectionDataPoint } from '@/context/GoalsContext';
import { Units } from '@/context/CalculatorContext';

interface ProjectionTableProps {
  isLoading: boolean;
  projectionData: ProjectionDataPoint[];
  showBodyFat: boolean;
  units: Units;
}

export function ProjectionTable({ 
  isLoading, 
  projectionData, 
  showBodyFat,
  units
}: ProjectionTableProps) {
  return (
    <Table>
      <TableCaption>
        {projectionData.length > 0 
          ? `Projected weight changes over ${projectionData.length - 1} weeks` 
          : 'Projected weight changes'}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Week</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Weight</TableHead>
          {showBodyFat && (
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
              {Array.from({ length: showBodyFat ? 7 : 4 }).map((_, j) => (
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
              {showBodyFat && (
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
  );
}
