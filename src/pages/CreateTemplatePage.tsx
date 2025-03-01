
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, MoreHorizontal, X } from "lucide-react";
import { ExerciseSelectionModal } from "@/components/workout/ExerciseSelectionModal";
import { Exercise } from "@/data/types";
import { useToast } from "@/hooks/use-toast";

const CreateTemplatePage = () => {
  const [templateName, setTemplateName] = useState("Evening Workout");
  const [notes, setNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const { toast } = useToast();

  const handleAddExercises = () => {
    setIsModalOpen(true);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    // Check if exercise is already selected
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
  };

  const handleCancelWorkout = () => {
    if (selectedExercises.length > 0 || templateName !== "Evening Workout" || notes) {
      // Show confirmation dialog if there are changes
      if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setTemplateName("Evening Workout");
    setNotes("");
    setSelectedExercises([]);
  };

  const handleSaveTemplate = () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "No exercises added",
        description: "Please add at least one exercise to your template",
        variant: "destructive"
      });
      return;
    }

    // Here we would save the workout template to the database
    toast({
      title: "Template Saved",
      description: `'${templateName}' has been saved successfully`,
    });
    
    // Reset form after saving
    resetForm();
  };

  console.log("Rendering CreateTemplatePage, selectedExercises:", selectedExercises.length);

  return (
    <AppLayout>
      <div className="px-4 py-6 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-gray-100"
          >
            <Clock className="w-6 h-6 text-gray-700" />
          </Button>
          
          <Button 
            variant="default" 
            className="rounded-full bg-grip-blue text-white"
            onClick={handleSaveTemplate}
          >
            Finish
          </Button>
        </div>

        <div className="mb-6">
          <Input 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="text-3xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-gray-400"
            placeholder="Workout Name"
          />
          
          <div className="flex items-center text-gray-500 mt-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>0:00</span>
            <Button variant="ghost" size="icon" className="ml-auto">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="min-h-[80px] resize-none mb-6 border-none bg-gray-50 placeholder:text-gray-400 focus-visible:ring-0"
        />

        {selectedExercises.length > 0 && (
          <div className="mb-6 space-y-3">
            {selectedExercises.map((exercise) => (
              <Card key={exercise.id} className="p-3 relative">
                <div className="flex items-center">
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{exercise.primaryMuscle}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-auto"
                    onClick={() => handleRemoveExercise(exercise.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button
          variant="default"
          className="w-full mb-4 bg-gray-100 text-grip-blue hover:bg-gray-200 hover:text-grip-blue-dark"
          onClick={handleAddExercises}
        >
          Add Exercises
        </Button>

        <Button
          variant="default"
          className="w-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
          onClick={handleCancelWorkout}
        >
          Cancel Workout
        </Button>

        {isModalOpen && (
          <ExerciseSelectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleExerciseSelect}
            selectedExercises={selectedExercises}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default CreateTemplatePage;
