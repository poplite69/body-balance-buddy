
import React from 'react';
import Tray from './Tray';
import { Button } from '@/components/ui/button';
import { ConfirmationTrayProps } from './types';

const ConfirmationTray: React.FC<ConfirmationTrayProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  danger = false,
  ...props
}) => {
  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return (
    <Tray 
      title={title}
      onClose={onClose}
      height={240}
      {...props}
    >
      <div className="space-y-4">
        <p>{message}</p>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={danger ? "destructive" : "default"}
            className="flex-1"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Tray>
  );
};

export default ConfirmationTray;
