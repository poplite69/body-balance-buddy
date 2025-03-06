
import React, { useRef, useEffect } from 'react';
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
}) => {
  const trayRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Apply appropriate classes based on position
  const positionClasses = {
    bottom: 'bottom-0 left-0 right-0 rounded-t-xl',
    top: 'top-0 left-0 right-0 rounded-b-xl',
    left: 'top-0 bottom-0 left-0 rounded-r-xl',
    right: 'top-0 bottom-0 right-0 rounded-l-xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in">
      <div 
        ref={trayRef}
        className={cn(
          'bg-background border shadow-lg animate-slide-in-up transition-all',
          positionClasses[position],
          'w-full max-w-md'
        )}
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          maxHeight: '90vh',
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
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Tray content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Tray;
