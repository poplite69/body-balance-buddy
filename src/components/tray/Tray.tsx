import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BaseTrayProps } from './types';
import './tray.css';

const Tray: React.FC<BaseTrayProps> = ({
  title,
  onClose,
  onBack,
  showBackButton = false,
  position = 'bottom',
  children,
  elevation = 2,
  id,
  zIndex,
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
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the transition duration
  };
  
  // Calculate positioning classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-[30px]';
      case 'top':
        return 'top-[30px]';
      case 'left':
        return 'left-[30px]';
      case 'right':
        return 'right-[30px]';
      default:
        return 'bottom-[30px]';
    }
  };
  
  return (
    <div 
      className="fixed inset-0 flex items-end justify-center bg-black/60 transition-opacity duration-300"
      style={{ 
        opacity: isVisible ? 1 : 0,
        zIndex: zIndex || 50
      }}
    >
      <div 
        ref={trayRef}
        data-elevation={elevation}
        id={id}
        className={cn(
          'tray-floating transition-all duration-300 ease-out',
          getPositionClasses(),
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        )}
        style={{ 
          maxHeight: 'calc(85vh - 60px)',
          zIndex: (zIndex || 50) + 1,
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
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    if (onBack) onBack();
                  }, 200);
                }}
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
        
        {/* Tray content with auto height */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Tray;
