
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, HelpCircle } from "lucide-react";
import { Exercise, MuscleGroup, ExerciseCategory } from "@/data/types";
import { exercisesDB } from "@/data/exercisesDatabase";

interface ExerciseSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
}

export const ExerciseSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedExercises
}: ExerciseSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState<MuscleGroup | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "all">("all");
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercisesDB);

  // Filter exercises based on search, body part, and category
  useEffect(() => {
    let filtered = exercisesDB;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(query) || 
        exercise.description.toLowerCase().includes(query)
      );
    }

    // Filter by body part
    if (selectedBodyPart !== "all") {
      filtered = filtered.filter(exercise => 
        exercise.primaryMuscle === selectedBodyPart || 
        exercise.secondaryMuscles.includes(selectedBodyPart)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(exercise => 
        exercise.category === selectedCategory
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedBodyPart, selectedCategory]);

  const getExerciseCount = (exerciseId: string) => {
    // In a real app, this would return the number of times this exercise has been used
    // For now, we'll just return a random number between 1 and 50
    return Math.floor(Math.random() * 50) + 1;
  };

  const bodyPartOptions: { label: string; value: MuscleGroup | "all" }[] = [
    { label: "Any Body Part", value: "all" },
    { label: "Chest", value: "chest" },
    { label: "Back", value: "back" },
    { label: "Shoulders", value: "shoulders" },
    { label: "Arms", value: "biceps" }, // Simplified to just "Arms"
    { label: "Legs", value: "quads" },  // Simplified to just "Legs"
    { label: "Core", value: "abs" },
  ];

  const categoryOptions: { label: string; value: ExerciseCategory | "all" }[] = [
    { label: "Any Category", value: "all" },
    { label: "Compound", value: "compound" },
    { label: "Upper Push", value: "upper_push" },
    { label: "Upper Pull", value: "upper_pull" },
    { label: "Lower Body", value: "lower_body" },
    { label: "Core", value: "core" },
    { label: "Cardio", value: "cardio" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md mx-auto max-h-[80vh] overflow-hidden" closeButtonLabel="Close">
        <div className="sticky top-0 bg-white z-10 p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <X className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-medium">New</h2>
          <div className="ml-auto space-x-2">
            <Button variant="ghost" disabled className="text-gray-400">
              Superset
            </Button>
            <Button variant="ghost" disabled className="text-gray-400">
              Add
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-gray-100 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3 mb-4">
            <div className="flex-1">
              <select 
                className="w-full py-2 px-3 rounded-md bg-gray-100 border-none text-gray-700"
                value={selectedBodyPart}
                onChange={(e) => setSelectedBodyPart(e.target.value as MuscleGroup | "all")}
              >
                {bodyPartOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select 
                className="w-full py-2 px-3 rounded-md bg-gray-100 border-none text-gray-700"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ExerciseCategory | "all")}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredExercises.length > 0 && (
          <>
            <div className="px-4 py-2 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">RECENT</h3>
            </div>
            <Separator />
            
            <ScrollArea className="max-h-[60vh]">
              {filteredExercises.map((exercise) => {
                const isSelected = selectedExercises.some(e => e.id === exercise.id);
                return (
                  <div key={exercise.id}>
                    <div 
                      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-gray-50' : ''}`}
                      onClick={() => onSelect(exercise)}
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                        <img 
                          src="/placeholder.svg" 
                          alt={exercise.name} 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{exercise.primaryMuscle}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500">{getExerciseCount(exercise.id)}</span>
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </div>
                );
              })}
            </ScrollArea>
          </>
        )}
        
        {filteredExercises.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No exercises found matching your criteria</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
