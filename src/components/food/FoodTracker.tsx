
import { BarChart2, Check, ChevronDown, Cross, Plus, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function FoodTracker() {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  
  // Mock nutrition data
  const nutritionSummary = {
    calories: { consumed: 1240, goal: 2200 },
    protein: { consumed: 86, goal: 120 },
    carbs: { consumed: 145, goal: 250 },
    fat: { consumed: 42, goal: 73 }
  };
  
  // Mock meal data
  const meals = [
    {
      type: "Breakfast",
      time: "7:30 AM",
      foods: [
        { name: "Oatmeal with banana", calories: 320, protein: 12, carbs: 58, fat: 6 },
        { name: "Coffee with milk", calories: 80, protein: 4, carbs: 6, fat: 4 }
      ]
    },
    {
      type: "Lunch",
      time: "12:30 PM",
      foods: [
        { name: "Chicken salad", calories: 420, protein: 35, carbs: 25, fat: 18 },
        { name: "Greek yogurt", calories: 120, protein: 15, carbs: 8, fat: 3 }
      ]
    },
    {
      type: "Snack",
      time: "3:30 PM",
      foods: [
        { name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0 },
        { name: "Handful of almonds", calories: 160, protein: 6, carbs: 6, fat: 14 }
      ]
    }
  ];
  
  // Calculate nutrition percentages
  const getPercentage = (consumed: number, goal: number) => {
    return Math.min(Math.round((consumed / goal) * 100), 100);
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className={cn("grip-section", fadeIn())}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-grip-neutral-800">Nutrition</h1>
            <p className="text-grip-neutral-500 mt-1">Track your daily food intake and macros</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="grip-button-ghost">
              <BarChart2 className="mr-2 h-4 w-4" />
              Weekly Report
            </Button>
            <Button className="grip-button" onClick={() => setQuickAddOpen(!quickAddOpen)}>
              <Plus className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>
      </section>
      
      {/* Quick add form (conditionally rendered) */}
      {quickAddOpen && (
        <section className={cn("grip-section", fadeIn(0.1))}>
          <Card className="grip-card border-2 border-grip-blue/20">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-grip-neutral-100">
              <CardTitle className="text-lg font-medium">Quick Add Food</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setQuickAddOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-grip-neutral-700 mb-1 block">
                      Food Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Chicken Breast"
                      className="grip-input w-full" 
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-sm font-medium text-grip-neutral-700 mb-1 block">
                      Meal
                    </label>
                    <div className="relative">
                      <select className="grip-input w-full appearance-none pr-8">
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grip-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-sm font-medium text-grip-neutral-700 mb-1 block">
                      Calories
                    </label>
                    <input 
                      type="number" 
                      placeholder="kcal"
                      className="grip-input w-full" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-grip-neutral-700 mb-1 block">
                      Protein
                    </label>
                    <input 
                      type="number" 
                      placeholder="g"
                      className="grip-input w-full" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-grip-neutral-700 mb-1 block">
                      Carbs
                    </label>
                    <input 
                      type="number" 
                      placeholder="g"
                      className="grip-input w-full" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-grip-neutral-700 mb-1 block">
                      Fat
                    </label>
                    <input 
                      type="number" 
                      placeholder="g"
                      className="grip-input w-full" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" className="grip-button-ghost" onClick={() => setQuickAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="grip-button">
                    <Check className="mr-2 h-4 w-4" />
                    Add Food
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
      
      {/* Nutrition summary */}
      <section className={cn("grip-section", fadeIn(0.2))}>
        <Card className="grip-card">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Today's Nutrition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-grip-neutral-700">Calories</h3>
                  <span className="text-sm text-grip-neutral-500">
                    {nutritionSummary.calories.consumed} / {nutritionSummary.calories.goal} kcal
                  </span>
                </div>
                <Progress 
                  value={getPercentage(nutritionSummary.calories.consumed, nutritionSummary.calories.goal)} 
                  className="h-2.5 bg-grip-neutral-100"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-grip-neutral-700">Protein</h3>
                  <span className="text-sm text-grip-neutral-500">
                    {nutritionSummary.protein.consumed} / {nutritionSummary.protein.goal} g
                  </span>
                </div>
                <Progress 
                  value={getPercentage(nutritionSummary.protein.consumed, nutritionSummary.protein.goal)} 
                  className="h-2.5 bg-grip-neutral-100"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-grip-neutral-700">Carbs</h3>
                  <span className="text-sm text-grip-neutral-500">
                    {nutritionSummary.carbs.consumed} / {nutritionSummary.carbs.goal} g
                  </span>
                </div>
                <Progress 
                  value={getPercentage(nutritionSummary.carbs.consumed, nutritionSummary.carbs.goal)} 
                  className="h-2.5 bg-grip-neutral-100"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-grip-neutral-700">Fat</h3>
                  <span className="text-sm text-grip-neutral-500">
                    {nutritionSummary.fat.consumed} / {nutritionSummary.fat.goal} g
                  </span>
                </div>
                <Progress 
                  value={getPercentage(nutritionSummary.fat.consumed, nutritionSummary.fat.goal)} 
                  className="h-2.5 bg-grip-neutral-100"
                />
              </div>
            </div>
            
            <div className="flex w-full h-14 mt-4 rounded-lg overflow-hidden border border-grip-neutral-100">
              <div className="bg-grip-blue h-full flex items-center justify-center text-white text-xs font-medium" style={{ width: '30%' }}>
                Protein 30%
              </div>
              <div className="bg-grip-blue/70 h-full flex items-center justify-center text-white text-xs font-medium" style={{ width: '45%' }}>
                Carbs 45%
              </div>
              <div className="bg-grip-blue/40 h-full flex items-center justify-center text-white text-xs font-medium" style={{ width: '25%' }}>
                Fat 25%
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Food log */}
      <section className={cn("grip-section", fadeIn(0.3))}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-grip-neutral-700">Today's Food Log</h2>
          
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-grip-neutral-400" />
            <input
              type="text"
              placeholder="Search foods..."
              className="grip-input pl-9 h-9 text-sm bg-grip-neutral-50/80"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          {meals.map((meal, index) => (
            <Card key={index} className="grip-card">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium text-grip-neutral-700">
                    {meal.type}
                  </CardTitle>
                  <span className="text-sm text-grip-neutral-500">{meal.time}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-grip-neutral-100">
                  {meal.foods.map((food, foodIndex) => (
                    <div key={foodIndex} className="py-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-grip-neutral-700">{food.name}</h4>
                        <div className="flex gap-3 mt-1 text-xs text-grip-neutral-500">
                          <span>{food.calories} kcal</span>
                          <span>P: {food.protein}g</span>
                          <span>C: {food.carbs}g</span>
                          <span>F: {food.fat}g</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-grip-neutral-400 hover:text-grip-neutral-600">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="py-3">
                    <Button variant="ghost" className="w-full justify-start text-grip-blue p-0 h-auto hover:bg-transparent hover:text-grip-blue-dark">
                      <Plus className="h-4 w-4 mr-1" />
                      Add food to {meal.type.toLowerCase()}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button className="grip-button w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add New Meal
          </Button>
        </div>
      </section>
    </div>
  );
}
