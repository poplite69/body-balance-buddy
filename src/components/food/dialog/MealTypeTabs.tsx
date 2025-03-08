
import { MealType } from "@/types/food";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MealTypeTabsProps {
  selectedMealType: MealType;
  onMealTypeChange: (value: MealType) => void;
}

export function MealTypeTabs({ selectedMealType, onMealTypeChange }: MealTypeTabsProps) {
  return (
    <Tabs 
      value={selectedMealType} 
      onValueChange={(value) => onMealTypeChange(value as MealType)} 
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
        <TabsTrigger value="lunch">Lunch</TabsTrigger>
        <TabsTrigger value="dinner">Dinner</TabsTrigger>
        <TabsTrigger value="snack">Snack</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
