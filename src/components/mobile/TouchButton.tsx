
import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TouchButtonProps extends ButtonProps {
  activeColor?: string;
}

/**
 * TouchButton - An enhanced button optimized for mobile touch interactions
 * with touch feedback, larger touch targets, and mobile-specific styling
 */
const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, activeColor = "bg-muted", children, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    
    return (
      <Button
        ref={ref}
        className={cn(
          // Mobile optimizations
          "h-12 min-w-[4rem] rounded-xl active:scale-95 transition-all duration-200",
          // Ensure large enough touch targets for fingers (min 44px)
          "touch-manipulation select-none",
          // Visual feedback when pressed
          isPressed && activeColor,
          className
        )}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

TouchButton.displayName = "TouchButton";

export { TouchButton };
