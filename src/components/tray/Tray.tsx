
import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BaseTrayProps } from './types';

const Tray: React.FC<BaseTrayProps> = ({
  title,
  onClose,
  onBack,
  showBackButton = false,
  position = 'bottom',
  height = 'auto',
  children,
  elevation = 2,
}) => {
  const trayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Set visible state after component mounts to trigger animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // Delay to allow animation to complete
  };
  
  // Calculate positioning classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-[60px]';
      case 'top':
        return 'top-[60px]';
      case 'left':
        return 'left-[60px]';
      case 'right':
        return 'right-[60px]';
      default:
        return 'bottom-[60px]';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-200"
         style={{ opacity: isVisible ? 1 : 0 }}>
      <div 
        ref={trayRef}
        data-elevation={elevation}
        className={cn(
          'absolute mx-4 tray-floating transition-all duration-300 ease-out bg-background',
          getPositionClasses(),
          isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-5',
          'w-auto max-w-md'
        )}
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          maxHeight: 'calc(85vh - 120px)',
        }}
      >
        {/* Tray header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center">
            {showBackButton && onBack && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2" 
                onClick={onBack}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Tray content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Tray;
