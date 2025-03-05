
import React, { useState, useEffect } from 'react';

interface WorkoutTimerProps {
  isActive: boolean;
  onTimeUpdate?: (seconds: number) => void;
  initialTime?: number;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ 
  isActive, 
  onTimeUpdate,
  initialTime = 0
}) => {
  const [seconds, setSeconds] = useState<number>(initialTime);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          if (onTimeUpdate) onTimeUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onTimeUpdate]);
  
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="font-mono text-2xl">{formatTime(seconds)}</div>
  );
};

export default WorkoutTimer;
