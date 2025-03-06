
import React from 'react';

export type TrayPosition = 'bottom' | 'top' | 'left' | 'right';

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

export interface ExerciseSelectorTrayProps {
  id?: string;
  onSelectExercise: (exercise: any) => void;
  position?: TrayPosition;
  // Remove onClose from this interface as it's automatically handled by TrayProvider
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

export type TrayComponent = React.ComponentType<any>;

export interface TrayItem {
  id: string;
  component: TrayComponent;
  props: any;
  parentId?: string;
}

export interface TrayContextValue {
  trays: TrayItem[];
  showTray: <P extends Record<string, any>>(
    TrayComponent: React.ComponentType<P>,
    props: Omit<P, 'id' | 'onClose' | 'showBackButton' | 'onBack' | 'parentId'>
  ) => string;
  closeTray: (id: string) => void;
  closeAllTrays: () => void;
  goBack: () => void;
}
