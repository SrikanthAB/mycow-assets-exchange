
import { createContext } from 'react';
import { PortfolioContextType } from '../types';

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);
