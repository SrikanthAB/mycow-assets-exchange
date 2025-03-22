
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

interface StakingHeaderProps {
  onStake: () => void;
}

const StakingHeader = ({ onStake }: StakingHeaderProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
      <div>
        <h2 className={`${theme === 'dark' ? 'text-white' : 'text-mycow-950'}`}>Yield Management</h2>
        <p className={`mt-2 max-w-2xl ${theme === 'dark' ? 'text-blue-300/80' : 'text-muted-foreground'}`}>
          Optimize returns on your tokenized RWAs by reinvesting yields into strategic allocations.
        </p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${
            theme === 'dark' 
              ? 'border-blue-500/50 text-blue-300 hover:bg-blue-900/30' 
              : 'border-primary/50 text-primary hover:bg-primary/10'
          }`} 
          onClick={onStake}
        >
          <Info size={16} />
          Learn About Yields
        </Button>
      </div>
    </div>
  );
};

export default StakingHeader;
