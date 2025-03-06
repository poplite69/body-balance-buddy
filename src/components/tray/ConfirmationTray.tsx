
import React from 'react';
import Tray from './Tray';
import { Button } from '@/components/ui/button';
import { ConfirmationTrayProps } from './types';

const ConfirmationTray: React.FC<ConfirmationTrayProps> = ({
  id,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  danger = false,
  zIndex,
  ...props
}) => {
  // We need to ensure onClose exists
  const handleClose = onClose || (() => {});
  
  const handleCancel = () => {
    if (onCancel) onCancel();
    handleClose();
  };
  
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };
  
  return (
    <Tray 
      id={id || ''}
      title={title}
      onClose={handleClose}
      zIndex={zIndex}
      elevation={danger ? 3 : 2}
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
