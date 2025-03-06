
import React from 'react';
import Tray from '@/components/tray/Tray';
import { Button } from '@/components/ui/button';
import { BrowserService } from '@/services/BrowserService';
import { Exercise } from './types';
import { TrayPosition } from '@/components/tray/types';
import { ExternalLink, Video } from 'lucide-react';

interface ExerciseInfoTrayProps {
  id?: string;
  exercise: Exercise;
  position?: TrayPosition;
  onClose: () => void;
}

const ExerciseInfoTray: React.FC<ExerciseInfoTrayProps> = ({
  id,
  exercise,
  position = 'bottom',
  onClose
}) => {
  const handleYouTubeClick = () => {
    const query = `How to do ${exercise.name} exercise`;
    const url = BrowserService.createYouTubeSearchUrl(query);
    BrowserService.openUrl(url, "YouTube - " + exercise.name);
  };

  const handleTikTokClick = () => {
    const query = `How to do ${exercise.name} exercise`;
    const url = BrowserService.createTikTokSearchUrl(query);
    BrowserService.openUrl(url, "TikTok - " + exercise.name);
  };

  return (
    <Tray
      id={id || ''}
      title={exercise.name}
      position={position}
      onClose={onClose}
      height={400}
    >
      <div className="space-y-4">
        {exercise.description && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p className="text-sm">{exercise.description}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Primary Muscle</h3>
          <p className="text-sm capitalize">{exercise.primary_muscle}</p>
        </div>
        
        {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Secondary Muscles</h3>
            <p className="text-sm capitalize">{exercise.secondary_muscles.join(', ')}</p>
          </div>
        )}
        
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Equipment</h3>
            <p className="text-sm capitalize">{exercise.equipment.join(', ')}</p>
          </div>
        )}
        
        {exercise.instructions && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Instructions</h3>
            <p className="text-sm">{exercise.instructions}</p>
          </div>
        )}
        
        <div className="pt-4">
          <h3 className="font-medium mb-2">Watch Video Tutorials</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleYouTubeClick}
              className="h-auto py-3"
            >
              <Video className="h-4 w-4 mr-2" /> YouTube
            </Button>
            <Button 
              onClick={handleTikTokClick}
              className="h-auto py-3"
            >
              <ExternalLink className="h-4 w-4 mr-2" /> TikTok
            </Button>
          </div>
        </div>
      </div>
    </Tray>
  );
};

export default ExerciseInfoTray;
