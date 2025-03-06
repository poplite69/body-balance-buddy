
import { useState, useEffect } from "react";
import { FoodItem } from "@/types/food";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Cache for portion options
const portionOptionsCache = new Map<string, any[]>();

interface PortionSelectProps {
  food: FoodItem;
  defaultPortion: number;
  defaultUnit: string;
  onPortionChange: (amount: number, unit: string) => void;
}

export function PortionSelect({ food, defaultPortion, defaultUnit, onPortionChange }: PortionSelectProps) {
  const [amount, setAmount] = useState<number>(defaultPortion);
  const [unit, setUnit] = useState<string>(defaultUnit);
  const [portionOptions, setPortionOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load portion options when food changes
  useEffect(() => {
    if (!food) return;

    const loadPortionOptions = async () => {
      // Check cache first
      if (portionOptionsCache.has(food.id)) {
        setPortionOptions(portionOptionsCache.get(food.id) || []);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('food_portion_options')
          .select('*')
          .eq('food_item_id', food.id)
          .order('is_default', { ascending: false });

        if (error) {
          console.error('Error loading portion options:', error);
          return;
        }

        // Add default serving option if not already in the data
        const hasDefaultServing = data.some(option => 
          option.amount === food.serving_size && option.unit === food.serving_unit
        );

        const options = hasDefaultServing ? data : [
          { 
            id: 'default', 
            description: '1 serving', 
            amount: food.serving_size, 
            unit: food.serving_unit, 
            is_default: data.length === 0 
          },
          ...data
        ];

        setPortionOptions(options);
        
        // Cache the options
        portionOptionsCache.set(food.id, options);

        // Set default if available
        const defaultOption = options.find(o => o.is_default) || options[0];
        if (defaultOption && (amount !== defaultOption.amount || unit !== defaultOption.unit)) {
          setAmount(defaultOption.amount);
          setUnit(defaultOption.unit);
          onPortionChange(defaultOption.amount, defaultOption.unit);
        }
      } catch (err) {
        console.error('Error loading portion options:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortionOptions();
  }, [food?.id]);

  const handlePortionSelect = (optionId: string) => {
    const option = portionOptions.find(o => o.id === optionId);
    if (option) {
      setAmount(option.amount);
      setUnit(option.unit);
      onPortionChange(option.amount, option.unit);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    if (!isNaN(newAmount) && newAmount > 0) {
      setAmount(newAmount);
      onPortionChange(newAmount, unit);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    onPortionChange(amount, newUnit);
  };

  if (!food) return null;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-1 block">Portion</label>
        {portionOptions.length > 0 && (
          <Select onValueChange={handlePortionSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a portion" />
            </SelectTrigger>
            <SelectContent>
              {portionOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.description} ({option.amount} {option.unit})
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom portion</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Amount</label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Unit</label>
          <Select value={unit} onValueChange={handleUnitChange}>
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={food.serving_unit}>{food.serving_unit}</SelectItem>
              {/* Common units - could be expanded */}
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="oz">oz</SelectItem>
              <SelectItem value="cup">cup</SelectItem>
              <SelectItem value="tbsp">tbsp</SelectItem>
              <SelectItem value="tsp">tsp</SelectItem>
              <SelectItem value="piece">piece</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
