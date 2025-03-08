
import { Search, Barcode, Zap, MessageSquare, FileEdit, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

type MethodTab = {
  id: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  isDraft?: boolean;
};

interface FoodEntryMethodsNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function FoodEntryMethodsNav({ activeTab, onTabChange }: FoodEntryMethodsNavProps) {
  const methods: MethodTab[] = [
    { id: "barcode", icon: Barcode, label: "Barcode", isDraft: true },
    { id: "search", icon: Search, label: "Search" },
    { id: "quick-add", icon: Zap, label: "Quick Add" },
    { id: "ai-describe", icon: MessageSquare, label: "AI Describe", isDraft: true },
    { id: "custom", icon: FileEdit, label: "Custom" },
    { id: "recipes", icon: BookOpen, label: "Recipes", isDraft: true },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view when changed
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="w-full border-b">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar py-1 px-1"
      >
        {methods.map((method) => (
          <button
            key={method.id}
            data-tab-id={method.id}
            onClick={() => onTabChange(method.id)}
            className={cn(
              "flex flex-row items-center justify-center px-3 py-2 mx-1 relative min-w-[80px] rounded-md whitespace-nowrap transition-colors",
              activeTab === method.id
                ? "text-primary bg-secondary"
                : "text-muted-foreground hover:bg-secondary/30"
            )}
          >
            <method.icon className="h-4 w-4 mr-1.5" />
            <span className="text-xs">{method.label}</span>
            {method.isDraft && (
              <span className="absolute -top-1 -right-1 text-[8px] px-1 bg-amber-500/90 text-white rounded-full font-medium">
                BETA
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
