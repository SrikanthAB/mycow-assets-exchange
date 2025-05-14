
import { createContext } from 'react';
import { PortfolioContextType } from '../types';

// Create the context with undefined as the default value
export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// The provider component is defined in PortfolioProvider.tsx
