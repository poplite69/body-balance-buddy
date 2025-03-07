
import { useState } from "react";
import { FoodEntryMethodsNav } from "./FoodEntryMethodsNav";
import { EnhancedFoodSearch } from "./EnhancedFoodSearch";
import { QuickAddFood } from "./QuickAddFood";
import { FoodItem, MealType } from "@/types/food";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoodLogEntryContainerProps {
  isOpen: boolean;
  onClose: () => void;
  mealType?: MealType;
  initialTab?: string;
  onFoodSelected: (food: FoodItem) => void;
  onQuickAdd: (foodData: Partial<FoodItem>) => void;
}

export function FoodLogEntryContainer({
  isOpen,
  onClose,
  mealType = "breakfast",
  initialTab = "search",
  onFoodSelected,
  onQuickAdd,
}: FoodLogEntryContainerProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "barcode":
        return (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Barcode Scanner (Coming Soon)</p>
          </div>
        );
      case "search":
        return <EnhancedFoodSearch onFoodSelect={onFoodSelected} />;
      case "quick-add":
        return <QuickAddFood mealType={mealType} onAdd={onQuickAdd} />;
      case "ai-describe":
        return (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">AI Food Description (Coming Soon)</p>
          </div>
        );
      case "custom":
        return (
          <div className="p-4">
            <p className="text-muted-foreground">Custom Food Creation</p>
            {/* Basic form for custom food creation will go here */}
          </div>
        );
      case "recipes":
        return (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Recipes (Coming Soon)</p>
          </div>
        );
      default:
        return <EnhancedFoodSearch onFoodSelect={onFoodSelected} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Add Food to {mealType}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <FoodEntryMethodsNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
}
