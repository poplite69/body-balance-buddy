
import { ArrowUp, Dumbbell, HeartPulse, Pizza, Sparkles, Timer, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className={cn("grip-section", fadeIn())}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-grip-neutral-800">Good morning, Alex</h1>
            <p className="text-grip-neutral-500 mt-1">Here's your health summary for today</p>
          </div>
          <Button className="grip-button mt-4 md:mt-0">
            <Zap className="mr-2 h-4 w-4" />
            Quick Log
          </Button>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's progress */}
          <Card className={cn("grip-card", fadeIn(0.1))}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-grip-neutral-700">
                <HeartPulse className="h-5 w-5 mr-2 text-grip-blue" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-grip-neutral-600">Calories</span>
                    <span className="text-sm text-grip-neutral-500">1,240 / 2,200</span>
                  </div>
                  <Progress value={56} className="h-2 bg-grip-neutral-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-grip-neutral-600">Water</span>
                    <span className="text-sm text-grip-neutral-500">4 / 8 cups</span>
                  </div>
                  <Progress value={50} className="h-2 bg-grip-neutral-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-grip-neutral-600">Steps</span>
                    <span className="text-sm text-grip-neutral-500">6,540 / 10,000</span>
                  </div>
                  <Progress value={65} className="h-2 bg-grip-neutral-100" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Workout */}
          <Card className={cn("grip-card", fadeIn(0.2))}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-grip-neutral-700">
                <Dumbbell className="h-5 w-5 mr-2 text-grip-blue" />
                Upcoming Workout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-grip-neutral-50 rounded-lg p-3 mb-3">
                <h4 className="font-medium text-grip-neutral-700">Upper Body Strength</h4>
                <p className="text-sm text-grip-neutral-500">Today at 5:30 PM • 45 min</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="text-xs bg-grip-blue-light/50 text-grip-blue px-2 py-1 rounded-full">
                  Bench Press
                </div>
                <div className="text-xs bg-grip-blue-light/50 text-grip-blue px-2 py-1 rounded-full">
                  Pull-ups
                </div>
                <div className="text-xs bg-grip-blue-light/50 text-grip-blue px-2 py-1 rounded-full">
                  Shoulder Press
                </div>
                <div className="text-xs bg-grip-blue-light/50 text-grip-blue px-2 py-1 rounded-full">
                  +3 more
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Insights */}
          <Card className={cn("grip-card", fadeIn(0.3))}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-grip-neutral-700">
                <Sparkles className="h-5 w-5 mr-2 text-grip-blue" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-grip-neutral-50 rounded-lg p-3 border-l-2 border-grip-blue">
                  <p className="text-sm text-grip-neutral-600">
                    Your sleep was disrupted last night. Consider a lighter workout today to aid recovery.
                  </p>
                </div>
                <div className="bg-grip-neutral-50 rounded-lg p-3 border-l-2 border-grip-blue/70">
                  <p className="text-sm text-grip-neutral-600">
                    You've been consistent with your protein intake - great job!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Nutrition and workout summary */}
      <section className={cn("grip-section", fadeIn(0.4))}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nutrition summary */}
          <Card className="grip-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center text-grip-neutral-700">
                <Pizza className="h-5 w-5 mr-2 text-grip-blue" />
                Nutrition Summary
              </CardTitle>
              <CardDescription>Today's macronutrient breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-grip-neutral-50 rounded-lg p-3 text-center">
                  <div className="text-grip-neutral-500 text-xs mb-1">Protein</div>
                  <div className="text-grip-neutral-800 font-medium">86g</div>
                  <div className="text-xs text-grip-blue flex items-center justify-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    12%
                  </div>
                </div>
                <div className="bg-grip-neutral-50 rounded-lg p-3 text-center">
                  <div className="text-grip-neutral-500 text-xs mb-1">Carbs</div>
                  <div className="text-grip-neutral-800 font-medium">145g</div>
                  <div className="text-xs text-grip-blue flex items-center justify-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    5%
                  </div>
                </div>
                <div className="bg-grip-neutral-50 rounded-lg p-3 text-center">
                  <div className="text-grip-neutral-500 text-xs mb-1">Fats</div>
                  <div className="text-grip-neutral-800 font-medium">42g</div>
                  <div className="text-xs text-grip-blue flex items-center justify-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    3%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-grip-blue mr-2"></div>
                    <span className="text-grip-neutral-600">Breakfast</span>
                  </div>
                  <span className="text-grip-neutral-500">420 kcal</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-grip-blue/70 mr-2"></div>
                    <span className="text-grip-neutral-600">Lunch</span>
                  </div>
                  <span className="text-grip-neutral-500">520 kcal</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-grip-blue/40 mr-2"></div>
                    <span className="text-grip-neutral-600">Dinner</span>
                  </div>
                  <span className="text-grip-neutral-500">300 kcal</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Workout tracking */}
          <Card className="grip-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center text-grip-neutral-700">
                <Timer className="h-5 w-5 mr-2 text-grip-blue" />
                Recent Workouts
              </CardTitle>
              <CardDescription>Your last 7 days of activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-grip-neutral-50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-grip-neutral-700">Lower Body</h4>
                    <p className="text-xs text-grip-neutral-500">Yesterday • 52 min</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-grip-neutral-500 mr-2">Intensity</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-2 h-6 rounded-sm mx-0.5", 
                            i <= 4 ? "bg-grip-blue" : "bg-grip-neutral-200"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-grip-neutral-50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-grip-neutral-700">Upper Body</h4>
                    <p className="text-xs text-grip-neutral-500">2 days ago • 45 min</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-grip-neutral-500 mr-2">Intensity</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-2 h-6 rounded-sm mx-0.5", 
                            i <= 3 ? "bg-grip-blue" : "bg-grip-neutral-200"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-grip-neutral-50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-grip-neutral-700">Cardio</h4>
                    <p className="text-xs text-grip-neutral-500">3 days ago • 30 min</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-grip-neutral-500 mr-2">Intensity</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-2 h-6 rounded-sm mx-0.5", 
                            i <= 2 ? "bg-grip-blue" : "bg-grip-neutral-200"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
