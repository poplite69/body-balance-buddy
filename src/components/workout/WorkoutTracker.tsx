
import { CalendarDays, ChevronRight, Dumbbell, Filter, Plus, RotateCcw, Search, Timer, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { currentWorkoutMock, workoutTemplates } from "@/data/exercises";
import { useState } from "react";
import { sortExercisesByCompletion } from "@/data/exerciseUtils";

export function WorkoutTracker() {
  // State for the mock data
  const [currentWorkout, setCurrentWorkout] = useState(currentWorkoutMock);
  const [isSorted, setIsSorted] = useState(false);
  
  // Calculate completed sets
  const completedSets = currentWorkout.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.completed).length, 
    0
  );
  
  const totalSets = currentWorkout.reduce(
    (total, exercise) => total + exercise.sets.length, 
    0
  );
  
  const progressPercentage = Math.round((completedSets / totalSets) * 100);
  
  // Add sorting functionality
  const handleSortExercises = () => {
    if (isSorted) {
      setCurrentWorkout([...currentWorkoutMock]);
    } else {
      setCurrentWorkout(sortExercisesByCompletion(currentWorkout));
    }
    setIsSorted(!isSorted);
  };
  
  console.log("WorkoutTracker rendering");
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className={cn("grip-section", fadeIn())}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-grip-neutral-800">Workouts</h1>
            <p className="text-grip-neutral-500 mt-1">Track and manage your training sessions</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="grip-button-ghost">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button className="grip-button">
              <Plus className="mr-2 h-4 w-4" />
              New Workout
            </Button>
          </div>
        </div>
      </section>
      
      {/* Current workout */}
      <section className={cn("grip-section", fadeIn(0.1))}>
        <Card className="grip-card overflow-hidden border-2 border-grip-neutral-800/20">
          <CardHeader className="bg-grip-neutral-50 border-b border-grip-neutral-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-medium flex items-center text-grip-neutral-700">
                <Dumbbell className="h-5 w-5 mr-2 text-grip-neutral-800" />
                Current Workout: Lower Body
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={handleSortExercises}
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  {isSorted ? "Reset Order" : "Sort by Progress"}
                </Button>
                <div className="flex items-center text-sm text-grip-neutral-500">
                  <Timer className="h-4 w-4 mr-1" />
                  32:45
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-grip-neutral-700">Progress</h3>
                <p className="text-sm text-grip-neutral-500">
                  {completedSets} of {totalSets} sets completed
                </p>
              </div>
              <Progress value={progressPercentage} className="w-32 h-2 bg-grip-neutral-100" />
            </div>
            
            <div className="space-y-4">
              {currentWorkout.map((exercise, index) => (
                <div key={exercise.exerciseId} className="border border-grip-neutral-100 rounded-lg overflow-hidden">
                  <div className="bg-grip-neutral-50 px-4 py-3 flex justify-between items-center">
                    <h4 className="font-medium text-grip-neutral-700">{exercise.name}</h4>
                    <div className="text-sm text-grip-neutral-500">
                      {exercise.sets.filter(s => s.completed).length} / {exercise.sets.length} sets
                    </div>
                  </div>
                  
                  <div className="divide-y divide-grip-neutral-100">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={cn(
                            "w-6 h-6 rounded-full mr-3 flex items-center justify-center border",
                            set.completed 
                              ? "bg-grip-neutral-800 border-grip-neutral-800 text-white" 
                              : "border-grip-neutral-300 text-grip-neutral-400"
                          )}>
                            {setIndex + 1}
                          </div>
                          <div>
                            <span className="font-medium text-grip-neutral-700">{set.weight} lbs</span>
                            <span className="text-grip-neutral-500 mx-2">×</span>
                            <span className="text-grip-neutral-700">{set.reps} reps</span>
                          </div>
                        </div>
                        
                        {set.completed ? (
                          <Button variant="ghost" size="sm" className="h-8 text-grip-neutral-500">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Undo
                          </Button>
                        ) : (
                          <Button size="sm" className="h-8 bg-grip-neutral-800 text-white hover:bg-grip-neutral-900">
                            Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button className="grip-button flex-1 bg-grip-neutral-800 hover:bg-grip-neutral-900">
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
              <Button variant="outline" className="grip-button-ghost flex-1">
                Finish Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Workout templates */}
      <section className={cn("grip-section", fadeIn(0.2))}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-grip-neutral-700">Your Workout Templates</h2>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-grip-neutral-600">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-grip-neutral-400" />
              <input
                type="text"
                placeholder="Search templates..."
                className="grip-input pl-9 h-9 text-sm bg-grip-neutral-50/80"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workoutTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="grip-card hover:border-grip-neutral-800/30 transition-all duration-200 cursor-pointer"
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-grip-neutral-700">{template.name}</h3>
                  <p className="text-sm text-grip-neutral-500">
                    {template.exercises.length} exercises • {template.lastPerformed}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-grip-neutral-400" />
              </CardContent>
            </Card>
          ))}
          
          <Card className="grip-card border-dashed border-grip-neutral-200 hover:border-grip-neutral-800/30 transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 flex justify-center items-center">
              <Button variant="ghost" className="text-grip-neutral-800 h-auto py-6">
                <Plus className="h-5 w-5 mr-2" />
                Create New Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
