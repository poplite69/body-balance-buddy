
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

/**
 * LoadingSpinner - A mobile-friendly loading spinner component
 * with size variations and fullscreen option
 */
const LoadingSpinner = ({ 
  size = 'md', 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader className={cn(
          "animate-spin",
          sizeClasses[size],
          className
        )} />
      </div>
    );
  }
  
  return (
    <Loader className={cn(
      "animate-spin",
      sizeClasses[size],
      className
    )} />
  );
};

export { LoadingSpinner };
