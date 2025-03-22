
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/ui/theme-provider";
import { usePortfolio } from "@/contexts/portfolio/usePortfolio";
import { Token } from "@/contexts/portfolio";
import StakingHeader from "@/components/staking/StakingHeader";
import YieldStrategiesSection from "@/components/staking/YieldStrategiesSection";
import ProjectedGrowthCard from "@/components/staking/ProjectedGrowthCard";
import StakingStats from "@/components/staking/StakingStats";
import StakeTokenModal from "@/components/StakeTokenModal";

// Placeholder data for yield strategies
const yieldStrategies = [
  {
    id: "strategy-1",
    name: "Conservative",
    description: "Lower risk investments focusing on stable assets with regular payouts",
    expectedReturn: "5-8%",
    assets: ["Real Estate", "Commodities", "Stablecoins"],
    risk: "Low"
  },
  {
    id: "strategy-2",
    name: "Balanced",
    description: "Diversified portfolio with a mix of stable and growth assets",
    expectedReturn: "8-12%",
    assets: ["Real Estate", "Entertainment", "Native Tokens"],
    risk: "Medium"
  },
  {
    id: "strategy-3",
    name: "Growth",
    description: "Focus on high growth potential assets with higher volatility",
    expectedReturn: "12-20%",
    assets: ["Private Credit", "Entertainment", "Native Tokens"],
    risk: "High"
  }
];

const Staking = () => {
  const { theme } = useTheme();
  const { tokens } = usePortfolio();
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState(yieldStrategies[0].id);
  
  // Filter staked tokens
  const stakedTokens = tokens.filter(token => token.staked);
  
  const handleStake = (token: Token) => {
    setSelectedToken(token);
    setIsStakeModalOpen(true);
  };
  
  const handleManageStakedToken = (token: Token) => {
    setSelectedToken(token);
    setIsStakeModalOpen(true);
  };
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <StakingHeader onStake={() => setIsStakeModalOpen(true)} />
            
            <StakingStats stakedTokens={stakedTokens} />
            
            <YieldStrategiesSection 
              strategies={yieldStrategies}
              selectedStrategy={selectedStrategy}
              setSelectedStrategy={setSelectedStrategy}
              stakedTokens={stakedTokens}
              onManageToken={handleManageStakedToken}
            />
            
            <ProjectedGrowthCard 
              stakedTokens={stakedTokens}
              selectedStrategy={yieldStrategies.find(s => s.id === selectedStrategy)}
            />
          </div>
        </section>
      </main>
      
      {isStakeModalOpen && (
        <StakeTokenModal 
          open={isStakeModalOpen}
          onOpenChange={setIsStakeModalOpen}
          tokens={tokens.filter(t => !t.staked)}
          initialToken={selectedToken}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Staking;
