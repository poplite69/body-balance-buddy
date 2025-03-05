
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface MobileFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onFormSubmit?: (e: React.FormEvent) => void;
}

/**
 * MobileForm - A form component optimized for mobile devices
 * - Handles keyboard visibility and adjusts layout
 * - Manages form submission
 * - Optimizes input focusing
 */
const MobileForm = React.forwardRef<HTMLFormElement, MobileFormProps>(
  ({ className, children, onFormSubmit, ...props }, ref) => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onFormSubmit?.(e);
      
      // Blur active element to hide keyboard
      const activeElement = document.activeElement as HTMLElement;
      activeElement?.blur();
    };
    
    // Setup keyboard detection
    React.useEffect(() => {
      const detectKeyboard = () => {
        // Simple heuristic: if viewport height changes significantly, keyboard is likely visible
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const windowHeight = window.innerHeight;
        
        // If viewport is significantly smaller than window, keyboard is likely visible
        setIsKeyboardVisible(viewportHeight < windowHeight * 0.8);
      };
      
      // Listen for viewport changes
      window.visualViewport?.addEventListener('resize', detectKeyboard);
      
      return () => {
        window.visualViewport?.removeEventListener('resize', detectKeyboard);
      };
    }, []);
    
    return (
      <form
        ref={ref}
        className={cn(
          "w-full space-y-4",
          // Adjust spacing when keyboard is visible
          isKeyboardVisible ? "pb-20" : "pb-4",
          className
        )}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    );
  }
);

MobileForm.displayName = "MobileForm";

export { MobileForm };
