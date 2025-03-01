
import { CalendarDays, ChevronRight, Dumbbell, Filter, Plus, RotateCcw, Search, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function WorkoutTracker() {
  // Mock exercise data
  const exercises = [
    { 
      name: "Barbell Squat", 
      sets: [
        { weight: 225, reps: 5, completed: true },
        { weight: 225, reps: 5, completed: true },
        { weight: 225, reps: 5, completed: false },
      ] 
    },
    { 
      name: "Romanian Deadlift", 
      sets: [
        { weight: 185, reps: 8, completed: true },
        { weight: 185, reps: 8, completed: false },
        { weight: 185, reps: 8, completed: false },
      ] 
    },
    { 
      name: "Leg Press", 
      sets: [
        { weight: 360, reps: 10, completed: false },
        { weight: 360, reps: 10, completed: false },
        { weight: 360, reps: 10, completed: false },
      ] 
    },
  ];

  // Mock workout templates
  const workoutTemplates = [
    { name: "Upper Body Strength", exercises: 8, lastPerformed: "2 days ago" },
    { name: "Lower Body Strength", exercises: 6, lastPerformed: "Yesterday" },
    { name: "Push Day", exercises: 7, lastPerformed: "4 days ago" },
    { name: "Pull Day", exercises: 7, lastPerformed: "5 days ago" },
  ];
  
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
        <Card className="grip-card overflow-hidden border-2 border-grip-blue/20">
          <CardHeader className="bg-grip-neutral-50 border-b border-grip-neutral-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-medium flex items-center text-grip-neutral-700">
                <Dumbbell className="h-5 w-5 mr-2 text-grip-blue" />
                Current Workout: Lower Body
              </CardTitle>
              <div className="flex items-center text-sm text-grip-neutral-500">
                <Timer className="h-4 w-4 mr-1" />
                32:45
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-grip-neutral-700">Progress</h3>
                <p className="text-sm text-grip-neutral-500">3 of 12 sets completed</p>
              </div>
              <Progress value={25} className="w-32 h-2 bg-grip-neutral-100" />
            </div>
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="border border-grip-neutral-100 rounded-lg overflow-hidden">
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
                              ? "bg-grip-blue border-grip-blue text-white" 
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
                          <Button size="sm" className="h-8 bg-grip-blue text-white hover:bg-grip-blue-dark">
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
              <Button className="grip-button flex-1">
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
          {workoutTemplates.map((template, index) => (
            <Card key={index} className="grip-card hover:border-grip-blue/30 transition-all duration-200 cursor-pointer">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-grip-neutral-700">{template.name}</h3>
                  <p className="text-sm text-grip-neutral-500">
                    {template.exercises} exercises • {template.lastPerformed}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-grip-neutral-400" />
              </CardContent>
            </Card>
          ))}
          
          <Card className="grip-card border-dashed border-grip-neutral-200 hover:border-grip-blue/30 transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 flex justify-center items-center">
              <Button variant="ghost" className="text-grip-blue h-auto py-6">
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
