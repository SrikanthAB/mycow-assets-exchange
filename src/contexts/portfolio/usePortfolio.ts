
import { useContext } from "react";
import { PortfolioContext } from "./provider/PortfolioContext";
import { PortfolioContextType } from "./types";

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  
  return context;
};
