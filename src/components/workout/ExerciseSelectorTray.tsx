import React, { useState } from 'react';
import { Search, Plus, Info, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTray } from '@/components/tray/TrayProvider';
import ExerciseInfoTray from './ExerciseInfoTray';
import Tray from '@/components/tray/Tray';
import { Exercise } from './types';

interface ExerciseSelectorTrayProps {
  id?: string;
  onClose?: () => void; // Make onClose optional as it's provided by TrayProvider
  onSelectExercise: (exercise: any) => void;
  position?: 'bottom' | 'top' | 'left' | 'right';
}

const ExerciseSelectorTray: React.FC<ExerciseSelectorTrayProps> = ({ 
  id,
  onClose = () => {}, // Provide default empty function if not provided
  onSelectExercise,
  position = 'bottom'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { showTray } = useTray();
  
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', searchQuery],
    queryFn: async () => {
      let query = supabase.from('exercises').select('*');
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    }
  });
  
  const handleSelectExercise = (exercise: any) => {
    onSelectExercise(exercise);
    if (onClose) onClose();
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInfoClick = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    // Create a properly typed props object for ExerciseInfoTray
    const trayProps = {
      exercise,
      position: 'bottom' as const // Type assertion to ensure position is correctly typed
    };
    
    showTray(ExerciseInfoTray, trayProps);
  };
  
  return (
    <Tray
      id={id || ''}
      title="Select Exercise"
      onClose={onClose}
      position={position}
      height="80vh"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center p-3 rounded-md">
                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            ))
          ) : exercises && exercises.length > 0 ? (
            exercises.map((exercise) => (
              <div 
                key={exercise.id} 
                className="flex items-center justify-between p-3 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => handleSelectExercise(exercise)}
              >
                <div className="flex items-center">
                  <p className="font-medium">{exercise.name}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-1"
                    onClick={(e) => handleInfoClick(exercise, e)}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground mr-2">{exercise.primary_muscle}</p>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No exercises found. Try a different search term.
            </p>
          )}
        </div>
      </div>
    </Tray>
  );
};

export default ExerciseSelectorTray;
