
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MobileInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
  onChangeText?: (value: string) => void;
  showClearButton?: boolean;
}

/**
 * MobileInput - A mobile-optimized input component with:
 * - Auto-focusing and keyboard optimization
 * - Clear button for easy text deletion
 * - Touch-optimized styling and feedback
 */
const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, onChangeText, showClearButton = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(props.value?.toString() || '');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChangeText?.(e.target.value);
    };

    const handleClear = () => {
      setInputValue('');
      onChangeText?.('');
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          className={cn(
            "h-12 px-4 text-base rounded-xl",
            "focus:ring-2 focus:ring-primary/70",
            // Ensure the input is large enough for touch input
            "touch-manipulation",
            // Add subtle animation on focus
            isFocused ? "shadow-sm" : "",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          value={inputValue}
          // Add mobile keyboard optimization
          inputMode="text"
          {...props}
        />
        
        {showClearButton && inputValue && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted"
            onClick={handleClear}
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

MobileInput.displayName = "MobileInput";

export { MobileInput };
