
import { useContext } from "react";
import { PortfolioContext } from "./PortfolioProvider";
import { PortfolioContextType } from "./types";

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context as PortfolioContextType;
};
