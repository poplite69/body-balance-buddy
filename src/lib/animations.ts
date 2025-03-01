
import { cn } from "@/lib/utils";

export const fadeIn = (delay: number = 0) => 
  cn("opacity-0 translate-y-4", 
     `animate-[fade-in_0.5s_ease-out_${delay}s_forwards]`);

export const slideIn = (delay: number = 0) => 
  cn("opacity-0 -translate-x-4", 
     `animate-[slide-in_0.3s_ease-out_${delay}s_forwards]`);

export const scaleIn = (delay: number = 0) => 
  cn("opacity-0 scale-95", 
     `animate-[scale-in_0.3s_ease-out_${delay}s_forwards]`);

export const staggerChildren = (baseDelay: number = 0.1) => {
  return (index: number) => ({
    animationDelay: `${baseDelay * index}s`,
  });
};

export const transitionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
};
