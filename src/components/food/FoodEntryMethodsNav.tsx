
import { Search, Barcode, Zap, MessageSquare, FileEdit, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="w-full border-b">
      <div className="flex overflow-x-auto no-scrollbar">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onTabChange(method.id)}
            className={cn(
              "flex flex-col items-center justify-center py-3 px-4 relative flex-1 min-w-[80px]",
              activeTab === method.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            <method.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{method.label}</span>
            {method.isDraft && (
              <span className="absolute top-1 right-1 text-[10px] text-amber-500 font-medium">
                DRAFT
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
