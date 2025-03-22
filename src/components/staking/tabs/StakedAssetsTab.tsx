
import { Card } from "@/components/ui/card";
import StakedTokensCard from "../StakedTokensCard";
import { Token } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";

interface StakedAssetsTabProps {
  stakedTokens: Token[];
  onManageToken: (token: Token) => void;
}

const StakedAssetsTab = ({ stakedTokens, onManageToken }: StakedAssetsTabProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <StakedTokensCard 
          stakedTokens={stakedTokens} 
          onManageToken={onManageToken} 
        />
      </div>
      
      <div className="lg:col-span-4">
        <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Yield Allocation</h3>
            
            {stakedTokens.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                Start staking your tokens to see your yield allocation
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Private Credit</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Entertainment Rights</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Native Tokens</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  Your yield is automatically redistributed according to your selected strategy
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StakedAssetsTab;
