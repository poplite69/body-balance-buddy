
import React from 'react';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    created_at: string;
    exercises: { name: string }[];
  };
  onOptionsClick: (templateId: string) => void;
}

export const TemplateCard = ({ template, onOptionsClick }: TemplateCardProps) => {
  // Format exercise names for display
  const exerciseText = template.exercises
    .slice(0, 3)
    .map(e => e.name)
    .join(', ');
  
  // Calculate days ago
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(template.created_at).getTime()) / (1000 * 3600 * 24)
  );
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{template.name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onOptionsClick(template.id)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{exerciseText}</p>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
