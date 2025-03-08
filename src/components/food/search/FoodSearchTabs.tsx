
import { cn } from "@/lib/utils";

interface FoodSearchTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function FoodSearchTabs({ activeTab, onTabChange }: FoodSearchTabsProps) {
  const tabs = [
    { id: "search", label: "Search" },
    { id: "recent", label: "Recent" },
    { id: "favorites", label: "Favorites" },
  ];

  return (
    <div className="w-full border-b mb-2">
      <div className="flex overflow-x-auto no-scrollbar py-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-row items-center justify-center px-3 py-2 mx-1 relative min-w-[80px] rounded-md whitespace-nowrap transition-colors text-xs",
              activeTab === tab.id
                ? "text-primary bg-secondary"
                : "text-muted-foreground hover:bg-secondary/30"
            )}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
