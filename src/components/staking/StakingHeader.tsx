
import { Button } from "@/components/ui/button";
import { Info, Sparkle } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useState } from "react";
import YieldInfoModal from "./modals/YieldInfoModal";

interface StakingHeaderProps {
  onStake: () => void;
}

const StakingHeader = ({ onStake }: StakingHeaderProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isYieldInfoOpen, setIsYieldInfoOpen] = useState(false);
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkle size={20} className={isDark ? "text-blue-400" : "text-primary"} />
          <h2 className={isDark ? "text-white" : "text-mycow-950"}>Yield on Yield Management</h2>
        </div>
        <p className={`mt-2 max-w-2xl ${isDark ? "text-blue-300/80" : "text-muted-foreground"}`}>
          Maximize returns on your tokenized RWAs by automatically reinvesting rental income into other high-yield products, creating a compounding effect.
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className={
            isDark 
              ? "border-blue-500/50 text-blue-300 hover:bg-blue-900/30" 
              : "border-primary/50 text-primary hover:bg-primary/10"
          } 
          onClick={onStake}
        >
          <Sparkle size={16} />
          Stake Tokens
        </Button>
        
        <Button 
          variant="outline" 
          className={
            isDark 
              ? "border-blue-500/50 text-blue-300 hover:bg-blue-900/30" 
              : "border-primary/50 text-primary hover:bg-primary/10"
          } 
          onClick={() => setIsYieldInfoOpen(true)}
        >
          <Info size={16} />
          Learn About Yields
        </Button>
      </div>

      <YieldInfoModal 
        open={isYieldInfoOpen}
        onOpenChange={setIsYieldInfoOpen}
      />
    </div>
  );
};

export default StakingHeader;
