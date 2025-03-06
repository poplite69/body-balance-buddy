
import { useTray } from './TrayProvider';
import ConfirmationTray from './ConfirmationTray';
import { ConfirmationTrayProps } from './types';

export const useTrayConfirmation = () => {
  const { showTray } = useTray();
  
  const confirm = (options: Omit<ConfirmationTrayProps, 'onClose'>) => {
    return showTray(ConfirmationTray, options);
  };
  
  return { confirm };
};
