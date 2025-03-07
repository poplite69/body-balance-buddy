
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { SearchBarProps } from "./types";

export function SearchBar({ 
  query, 
  setQuery, 
  handleSearch, 
  clearSearch, 
  isSearching,
  inputRef
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          placeholder="Search for a food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pr-8 min-h-10"
          style={{ 
            height: 'auto',
            minHeight: '2.5rem',
            maxHeight: '5rem',
            resize: 'none',
            overflow: 'hidden'
          }}
        />
        {query && (
          <X
            className="absolute top-1/2 right-2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
            onClick={clearSearch}
          />
        )}
      </div>
      <Button 
        onClick={handleSearch} 
        disabled={!query.trim() || isSearching}
        className="w-10 h-10 p-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
