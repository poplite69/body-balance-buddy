
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FoodFavoriteButtonProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function FoodFavoriteButton({ isFavorite, onToggleFavorite }: FoodFavoriteButtonProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onToggleFavorite}
      className={isFavorite ? "text-red-500" : "text-muted-foreground"}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  );
}
