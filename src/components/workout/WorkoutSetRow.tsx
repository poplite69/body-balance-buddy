
import React from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WorkoutSet } from './types';

interface WorkoutSetRowProps {
  set: WorkoutSet;
  index: number;
  updateSet: (index: number, field: 'weight' | 'reps' | 'completed', value: any) => void;
  savingSet: string | null;
}

const WorkoutSetRow: React.FC<WorkoutSetRowProps> = ({ 
  set, 
  index, 
  updateSet,
  savingSet
}) => {
  return (
    <div className="grid grid-cols-5 gap-1 mb-1">
      <div className="bg-muted rounded-md flex items-center justify-center text-xs font-medium text-muted-foreground h-8">
        {set.set_number}
      </div>
      <div className="text-xs flex items-center text-muted-foreground">
        {set.previous_weight !== null && set.previous_weight !== undefined && 
         set.previous_reps !== null && set.previous_reps !== undefined ? (
          `${set.previous_weight}×${set.previous_reps}`
        ) : (
          ''
        )}
      </div>
      <div>
        <Input
          type="number"
          value={set.weight || ''}
          onChange={(e) => updateSet(index, 'weight', e.target.value ? Number(e.target.value) : null)}
          className={`text-center h-8 text-xs px-1 ${set.previous_weight !== null && set.previous_weight !== undefined ? 'bg-background/90 border-muted' : ''}`}
          placeholder={set.previous_weight !== null && set.previous_weight !== undefined ? `${set.previous_weight}` : ''}
        />
      </div>
      <div>
        <Input
          type="number"
          value={set.reps || ''}
          onChange={(e) => updateSet(index, 'reps', e.target.value ? Number(e.target.value) : null)}
          className={`text-center h-8 text-xs px-1 ${set.previous_reps !== null && set.previous_reps !== undefined ? 'bg-background/90 border-muted' : ''}`}
          placeholder={set.previous_reps !== null && set.previous_reps !== undefined ? `${set.previous_reps}` : ''}
        />
      </div>
      <div className="flex justify-center items-center">
        <Button
          variant={set.completed ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => updateSet(index, 'completed', !set.completed)}
          disabled={savingSet === set.id}
        >
          <Check className={`h-3.5 w-3.5 ${set.completed ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
        </Button>
      </div>
    </div>
  );
};

export default WorkoutSetRow;
