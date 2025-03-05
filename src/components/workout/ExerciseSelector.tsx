
import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: any) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelectExercise 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
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
    onClose();
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Select Exercise</DialogTitle>
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
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
          
          <div className="space-y-2">
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
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">{exercise.primary_muscle}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No exercises found. Try a different search term.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseSelector;
