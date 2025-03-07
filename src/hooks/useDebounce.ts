
import { useCallback } from "react";

/**
 * A custom hook for debouncing function calls
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const debounced = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      
      return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        
        timer = setTimeout(() => {
          callback(...args);
          timer = null;
        }, delay);
      };
    })(),
    [callback, delay]
  );

  return debounced;
}
