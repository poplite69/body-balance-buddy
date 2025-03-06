
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  segments?: {
    value: number
    color: string
  }[]
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, segments, ...props }, ref) => {
  if (segments) {
    // Calculate total width of all segments (should not exceed 100%)
    const totalWidth = Math.min(
      segments.reduce((sum, segment) => sum + segment.value, 0),
      100
    )

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div className="flex h-full w-full">
          {segments.map((segment, index) => (
            <div
              key={index}
              className={`h-full transition-all`}
              style={{
                width: `${segment.value}%`,
                backgroundColor: segment.color,
              }}
            />
          ))}
          {/* If segments don't add up to 100%, fill the rest with transparent */}
          {totalWidth < 100 && (
            <div
              className="h-full"
              style={{ width: `${100 - totalWidth}%` }}
            />
          )}
        </div>
      </ProgressPrimitive.Root>
    )
  }

  // Original implementation for a single progress value
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
