
import { usePortfolio } from "@/contexts/portfolio";
import { Token } from "@/contexts/portfolio";
import { calculateYieldStats } from "./utils/stakingUtils";
import StakedAssetsCard from "./cards/StakedAssetsCard";
import PrimaryYieldCard from "./cards/PrimaryYieldCard";
import CompoundEffectCard from "./cards/CompoundEffectCard";

interface StakingStatsProps {
  stakedTokens: Token[];
}

const StakingStats = ({ stakedTokens }: StakingStatsProps) => {
  const { getTotalPortfolioValue } = usePortfolio();
  
  const totalPortfolioValue = getTotalPortfolioValue();
  const totalStakedValue = stakedTokens.reduce((sum, token) => sum + (token.price * token.balance), 0);
  const stakedPercentage = totalPortfolioValue > 0 ? (totalStakedValue / totalPortfolioValue) * 100 : 0;
  
  // Calculate all yield statistics
  const {
    primaryYield,
    annualPrimaryYield,
    secondaryYield,
    annualSecondaryYield,
    totalAnnualYield,
    combinedYieldRate
  } = calculateYieldStats(totalStakedValue);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <StakedAssetsCard 
        stakedTokens={stakedTokens}
        totalStakedValue={totalStakedValue}
        stakedPercentage={stakedPercentage}
      />
      
      <PrimaryYieldCard 
        annualPrimaryYield={annualPrimaryYield}
        primaryYield={primaryYield}
      />
      
      <CompoundEffectCard 
        totalAnnualYield={totalAnnualYield}
        combinedYieldRate={combinedYieldRate}
        annualPrimaryYield={annualPrimaryYield}
        annualSecondaryYield={annualSecondaryYield}
        primaryYield={primaryYield}
        secondaryYield={secondaryYield}
      />
    </div>
  );
};

export default StakingStats;
