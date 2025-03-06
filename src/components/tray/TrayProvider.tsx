
import React, { createContext, useContext, useState } from 'react';
import { TrayContextValue, TrayItem, TrayComponent } from './types';
import { v4 as uuidv4 } from 'uuid';

const TrayContext = createContext<TrayContextValue | undefined>(undefined);

export const TrayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trays, setTrays] = useState<TrayItem[]>([]);
  
  // Show a new tray with generic props typing
  const showTray = <P extends Record<string, any>>(
    TrayComponent: React.ComponentType<P>, 
    props: Omit<P, 'id' | 'onClose' | 'showBackButton' | 'onBack' | 'parentId'>
  ): string => {
    const id = props.id || uuidv4();
    
    const newTray: TrayItem = {
      id,
      component: TrayComponent,
      props: {
        ...props,
        id, // Ensure id is always passed to the component
        onClose: () => closeTray(id),
        ...(trays.length > 0 ? { 
          showBackButton: true,
          onBack: () => goBack(),
          parentId: trays[trays.length - 1].id
        } : {})
      }
    };
    
    setTrays(current => [...current, newTray]);
    return id;
  };
  
  // Close a specific tray
  const closeTray = (id: string) => {
    // Find the tray and any child trays
    const index = trays.findIndex(tray => tray.id === id);
    
    if (index !== -1) {
      // Also remove any child trays
      setTrays(current => current.slice(0, index));
    }
  };
  
  // Go back to previous tray
  const goBack = () => {
    if (trays.length > 1) {
      setTrays(current => current.slice(0, -1));
    }
  };
  
  // Close all trays
  const closeAllTrays = () => {
    setTrays([]);
  };
  
  const value: TrayContextValue = {
    trays,
    showTray,
    closeTray,
    closeAllTrays,
    goBack
  };
  
  return (
    <TrayContext.Provider value={value}>
      {children}
      
      {/* Render active trays */}
      {trays.length > 0 && (
        <div className="tray-container">
          {trays.map((tray, index) => {
            const TrayComp = tray.component;
            return <TrayComp key={tray.id} {...tray.props} />;
          })}
        </div>
      )}
    </TrayContext.Provider>
  );
};

export const useTray = () => {
  const context = useContext(TrayContext);
  if (context === undefined) {
    throw new Error('useTray must be used within a TrayProvider');
  }
  return context;
};
