
import React from 'react';
import { ProjectionDataPoint } from '@/context/GoalsContext';
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

interface ProjectionChartProps {
  data: ProjectionDataPoint[];
  showBodyFat: boolean;
}

export function ProjectionChart({ data, showBodyFat }: ProjectionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5 }} />
        <YAxis yAxisId="left" domain={['dataMin - 2', 'dataMax + 2']} label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} label={{ value: 'Body Fat %', angle: 90, position: 'insideRight' }} />
        <Tooltip formatter={(value) => [parseFloat(String(value)).toFixed(1), '']} />
        <Legend />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="weight" 
          name="Weight (kg)" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
        {showBodyFat && (
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
  );
}
