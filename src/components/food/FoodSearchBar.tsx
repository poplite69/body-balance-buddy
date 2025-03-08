
import { useRef } from "react";
import { Search as SearchIcon, Barcode, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FoodSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenEntryContainer: (tab: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const FoodSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onOpenEntryContainer,
  inputRef
}: FoodSearchBarProps) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-background/80 backdrop-blur-sm border-t border-border z-50">
      <div className="flex flex-col max-w-md mx-auto">
        <div className="relative">
          <div className="flex items-center bg-gray-800/70 rounded-full px-4 text-gray-100">
            <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search for a food"
              className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white py-5"
            />
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                e.stopPropagation();
                onOpenEntryContainer("barcode");
              }}>
                <Barcode className="h-5 w-5 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                e.stopPropagation();
                onOpenEntryContainer("ai-describe");
              }}>
                <Mic className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
