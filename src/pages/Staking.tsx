
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

// Updated yield strategies with more detailed information
const yieldStrategies = [
  {
    id: "strategy-1",
    name: "Conservative",
    description: "Focus on senior tranches of private credit with stable returns and lower risk",
    expectedReturn: "5-8%",
    assets: ["Private Credit", "Real Estate", "Stablecoins"],
    risk: "Low"
  },
  {
    id: "strategy-2",
    name: "Balanced",
    description: "Diversified portfolio of private credit and select entertainment rights",
    expectedReturn: "8-15%",
    assets: ["Private Credit", "Entertainment", "Real Estate"],
    risk: "Medium"
  },
  {
    id: "strategy-3",
    name: "Growth",
    description: "Higher exposure to entertainment rights and junior credit tranches for maximum returns",
    expectedReturn: "15-25%",
    assets: ["Entertainment", "Junior Tranches", "Native Tokens"],
    risk: "High"
  }
];

const Staking = () => {
  const { theme } = useTheme();
  const { tokens } = usePortfolio();
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState(yieldStrategies[0].id);
  
  // Filter staked and unstaked tokens
  const stakedTokens = tokens.filter(token => token.staked);
  const unstackedTokens = tokens.filter(token => !token.staked);
  
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
          tokens={unstackedTokens}
          initialToken={selectedToken}
          strategy={yieldStrategies.find(s => s.id === selectedStrategy)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Staking;
