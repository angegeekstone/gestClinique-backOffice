import React, { createContext, useContext, ReactNode } from 'react';
import { usePeriodFilter, type DateRange, type UsePeriodFilterReturn } from '../hooks/usePeriodFilter';

interface DashboardContextType extends UsePeriodFilterReturn {
  // Peut être étendu avec d'autres fonctionnalités du dashboard
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const periodFilter = usePeriodFilter();

  const contextValue: DashboardContextType = {
    ...periodFilter
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};