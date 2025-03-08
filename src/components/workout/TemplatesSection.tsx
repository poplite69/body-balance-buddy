
import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileSkeletonList } from '@/components/mobile/MobileSkeletonList';
import TemplateCard from './TemplateCard';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  exercises: { name: string }[];
}

interface TemplatesSectionProps {
  templates: Template[] | undefined;
  isLoading: boolean;
  onTemplateOptions: (templateId: string) => void;
}

export const TemplatesSection = ({ 
  templates, 
  isLoading, 
  onTemplateOptions 
}: TemplatesSectionProps) => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Templates</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/create-template')}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Templates subheader */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">
          My Templates {templates && `(${templates.length})`}
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      
      {isLoading ? (
        <MobileSkeletonList rows={3} className="gap-4" rowHeight="h-28" />
      ) : templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map(template => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              onOptionsClick={onTemplateOptions} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          No templates found. Create your first template.
        </p>
      )}
    </section>
  );
};

export default TemplatesSection;
