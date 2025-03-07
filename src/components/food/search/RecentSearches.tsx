
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RecentSearchesProps } from "./types";

export function RecentSearches({ recentSearches, onRecentSearchClick }: RecentSearchesProps) {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="my-3">
      <div className="text-sm font-medium flex items-center gap-1 mb-2">
        <Clock className="h-3 w-3" /> Recent Searches
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((term, i) => (
          <Badge 
            key={i} 
            variant="outline"
            className="cursor-pointer hover:bg-muted"
            onClick={() => onRecentSearchClick(term)}
          >
            {term}
          </Badge>
        ))}
      </div>
    </div>
  );
}
