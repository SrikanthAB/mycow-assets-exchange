
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolio } from "@/contexts/portfolio";
import StakeTokenModal from "@/components/StakeTokenModal";
import StakingHeader from "@/components/staking/StakingHeader";
import StakingStats from "@/components/staking/StakingStats";
import YieldStrategiesSection from "@/components/staking/YieldStrategiesSection";
import ProjectedGrowthCard from "@/components/staking/ProjectedGrowthCard";

const yieldStrategies = [
  {
    id: "conservative",
    name: "Conservative",
    description: "Low-risk investments with stable returns",
    expectedReturn: "5-7% APY",
    assets: ["Residential REIT", "Gold", "Stablecoins"],
    risk: "Low"
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Medium-risk investments with moderate returns",
    expectedReturn: "8-12% APY",
    assets: ["Commercial REIT", "Private Credit", "MyCow Token"],
    risk: "Medium"
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "Higher-risk investments with potential for higher returns",
    expectedReturn: "13-20% APY",
    assets: ["Entertainment Funds", "Development REIT", "Startup Equity"],
    risk: "High"
  }
];

const Staking = () => {
  const { tokens } = usePortfolio();
  const [selectedStrategy, setSelectedStrategy] = useState("balanced");
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  
  const stakedTokens = tokens.filter(token => token.balance > 0);
  
  const handleStake = (token: any) => {
    setSelectedToken(token);
    setIsStakeModalOpen(true);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <StakingHeader />
            <StakingStats />
            
            <YieldStrategiesSection 
              strategies={yieldStrategies}
              selectedStrategy={selectedStrategy}
              setSelectedStrategy={setSelectedStrategy}
              stakedTokens={stakedTokens}
              onManageToken={handleStake}
            />
            
            <ProjectedGrowthCard />
          </div>
        </section>
      </main>
      
      {selectedToken && (
        <StakeTokenModal
          isOpen={isStakeModalOpen}
          onClose={() => setIsStakeModalOpen(false)}
          token={selectedToken}
          strategy={yieldStrategies.find(s => s.id === selectedStrategy)!}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Staking;
