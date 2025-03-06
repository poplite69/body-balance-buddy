import React from 'react';

export interface ConfirmationTrayProps {
  id?: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  danger?: boolean;
}

export interface BaseTrayProps {
  id?: string;
  title: string;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  position?: 'bottom' | 'top' | 'left' | 'right';
  height?: number | string;
  children: React.ReactNode;
  elevation?: 1 | 2 | 3;
}
