
import { ReactNode } from 'react';

export type TrayPosition = 'bottom' | 'top' | 'left' | 'right';

export interface BaseTrayProps {
  id: string;
  title: string;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  position?: TrayPosition;
  height?: string | number;
  children: ReactNode;
}

export interface TrayOptions {
  id?: string;
  title: string;
  position?: TrayPosition;
  height?: string | number;
  onClose?: () => void;
}

export interface ConfirmationTrayProps extends TrayOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  danger?: boolean;
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
  showTray: <T extends { id?: string }>(TrayComponent: TrayComponent, props: T) => string;
  closeTray: (id: string) => void;
  closeAllTrays: () => void;
  goBack: () => void;
}
