
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FoodItem } from "@/types/food";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PortionOption {
  id: string;
  description: string;
  amount: number;
  unit: string;
  is_default: boolean;
}

interface PortionSelectProps {
  food: FoodItem;
  defaultPortion: number;
  defaultUnit: string;
  onPortionChange: (amount: number, unit: string) => void;
}

export function PortionSelect({ 
  food, 
  defaultPortion, 
  defaultUnit, 
  onPortionChange 
}: PortionSelectProps) {
  const [portionOptions, setPortionOptions] = useState<PortionOption[]>([]);
  const [customAmount, setCustomAmount] = useState<number>(defaultPortion);
  const [selectedOption, setSelectedOption] = useState<string>("custom");
  const [isLoading, setIsLoading] = useState(true);

  // Load portion options from the database
  useEffect(() => {
    async function loadPortionOptions() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('food_portion_options')
          .select('*')
          .eq('food_item_id', food.id)
          .order('is_default', { ascending: false });
          
        if (error) {
          console.error("Error loading portion options:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setPortionOptions(data as PortionOption[]);
          
          // Check if any option matches the default portion and unit
          const matchingOption = data.find(
            opt => opt.amount === defaultPortion && opt.unit === defaultUnit
          );
          
          if (matchingOption) {
            setSelectedOption(matchingOption.id);
          } else {
            // Create a custom option based on the default values
            setCustomAmount(defaultPortion);
            setSelectedOption("custom");
          }
        } else {
          // If no options, create default option based on food serving size
          const defaultOption: PortionOption = {
            id: "default",
            description: "1 serving",
            amount: food.serving_size,
            unit: food.serving_unit,
            is_default: true
          };
          setPortionOptions([defaultOption]);
          
          if (defaultPortion === food.serving_size && defaultUnit === food.serving_unit) {
            setSelectedOption("default");
          } else {
            setCustomAmount(defaultPortion);
            setSelectedOption("custom");
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    if (food) {
      loadPortionOptions();
    }
  }, [food, defaultPortion, defaultUnit]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    
    if (value === "custom") {
      onPortionChange(customAmount, defaultUnit);
    } else {
      const option = portionOptions.find(opt => opt.id === value);
      if (option) {
        onPortionChange(option.amount, option.unit);
        setCustomAmount(option.amount);
      }
    }
  };

  const handleCustomAmountChange = (value: number) => {
    setCustomAmount(value);
    setSelectedOption("custom");
    onPortionChange(value, defaultUnit);
  };

  if (isLoading) {
    return <div className="h-[76px] animate-pulse bg-muted rounded" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Portion</Label>
        <Select value={selectedOption} onValueChange={handleOptionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select portion" />
          </SelectTrigger>
          <SelectContent>
            {portionOptions.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.description} ({option.amount} {option.unit})
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedOption === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.1"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              type="text"
              value={defaultUnit}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
}
