
import React, { useRef, useState, useEffect } from "react";
import { Search as SearchIcon, ScanBarcode, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onScanBarcode?: () => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function ExpandableSearchInput({
  value,
  onChange,
  onScanBarcode,
  onClear,
  placeholder = "Search for a food",
  className,
  autoFocus = false,
}: ExpandableSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputHeight, setInputHeight] = useState<number>(48); // Default single line height
  const [isFocused, setIsFocused] = useState<boolean>(autoFocus);

  // Check if text exceeds single line and adjust height accordingly
  useEffect(() => {
    if (inputRef.current) {
      // Create a hidden div to measure text width
      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.position = 'absolute';
      hiddenDiv.style.visibility = 'hidden';
      hiddenDiv.style.whiteSpace = 'nowrap';
      hiddenDiv.style.fontSize = window.getComputedStyle(inputRef.current).fontSize;
      hiddenDiv.style.fontFamily = window.getComputedStyle(inputRef.current).fontFamily;
      hiddenDiv.style.fontWeight = window.getComputedStyle(inputRef.current).fontWeight;
      hiddenDiv.style.letterSpacing = window.getComputedStyle(inputRef.current).letterSpacing;
      hiddenDiv.textContent = value;
      
      document.body.appendChild(hiddenDiv);
      
      // Get available width for text (input width minus padding and icon space)
      const availableWidth = inputRef.current.offsetWidth - 80; // Adjust based on your padding and icon width
      const textWidth = hiddenDiv.offsetWidth;
      
      document.body.removeChild(hiddenDiv);
      
      // If text width exceeds available space, increase height to two lines
      setInputHeight(textWidth > availableWidth ? 72 : 48);
    }
  }, [value]);

  // Auto focus on mount if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div 
      className={cn(
        "relative flex items-center bg-gray-800/70 rounded-full px-4 transition-all duration-150 ease-in-out",
        isFocused ? "bg-gray-800/90 ring-1 ring-primary/30" : "",
        className
      )}
      style={{ height: `${inputHeight}px` }}
    >
      <SearchIcon className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none text-white placeholder:text-gray-400 focus:outline-none py-3"
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ height: `${inputHeight}px` }}
      />
      
      <div className="flex gap-3 ml-2">
        {value && (
          <button 
            onClick={() => onClear?.()}
            className="p-1 hover:bg-gray-700/50 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
        
        <button
          onClick={() => onScanBarcode?.()}
          className="p-1 hover:bg-gray-700/50 rounded-full"
        >
          <ScanBarcode className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
