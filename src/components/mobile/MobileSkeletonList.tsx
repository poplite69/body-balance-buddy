
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MobileSkeletonListProps {
  rows?: number;
  className?: string;
  rowHeight?: string;
  withImage?: boolean;
  variant?: 'list' | 'card';
}

/**
 * MobileSkeletonList - A skeleton loader specifically designed for 
 * mobile list views, resembling common mobile app list layouts
 */
const MobileSkeletonList = ({
  rows = 5,
  className,
  rowHeight = "h-16",
  withImage = true,
  variant = 'list'
}: MobileSkeletonListProps) => {
  if (variant === 'card') {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div 
            key={i}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg animate-pulse", 
            rowHeight
          )}
        >
          {withImage && (
            <Skeleton className="rounded-md w-12 h-12 flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export { MobileSkeletonList };
