
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Token, usePortfolio } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";
import { ArrowUpRight, Sparkle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StakedTokensCardProps {
  stakedTokens: Token[];
  onManageToken: (token: Token) => void;
}

const StakedTokensCard = ({ stakedTokens, onManageToken }: StakedTokensCardProps) => {
  const { theme } = useTheme();
  const { toggleTokenStaking, addTransaction } = usePortfolio();
  const { toast } = useToast();
  const isDark = theme === 'dark';
  
  const handleUnstake = async (token: Token) => {
    try {
      // Unstake the token
      toggleTokenStaking(token.id, false);
      
      // Add transaction record for unstaking
      await addTransaction({
        type: 'unstake',
        asset: token.id,
        amount: token.balance,
        value: token.price * token.balance,
        status: 'completed'
      });
      
      toast({
        title: "Tokens Unstaked Successfully",
        description: `You have unstaked ${token.balance} ${token.symbol} tokens.`
      });
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      toast({
        title: "Error Unstaking Tokens",
        description: "There was an error unstaking your tokens. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className={isDark ? "bg-[#0f172a] border-blue-900/50 text-white" : "border-primary/20"}>
      <CardHeader>
        <CardTitle className={isDark ? "text-white" : ""}>Your Staked Tokens</CardTitle>
        <CardDescription className={isDark ? "text-blue-300/80" : ""}>
          Tokens generating primary and secondary yields
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stakedTokens.length > 0 ? (
          <div className="space-y-4">
            {stakedTokens.map(token => (
              <div 
                key={token.id} 
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isDark 
                    ? "bg-[#1e293b] border-blue-900/30" 
                    : "bg-white border-primary/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    isDark ? "bg-[#1e3a8a]" : "bg-primary"
                  }`}>
                    {token.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? "text-white" : ""}`}>{token.name}</h4>
                    <div className="flex items-center text-sm">
                      <Badge 
                        variant="secondary" 
                        className={`mr-2 ${
                          isDark 
                            ? "bg-blue-800/50 text-blue-300" 
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {token.category}
                      </Badge>
                      <span className={isDark ? "text-blue-300/80" : "text-muted-foreground"}>
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className={`font-medium ${isDark ? "text-white" : ""}`}>
                    {token.balance} tokens
                  </div>
                  
                  <div className="flex items-center text-sm mt-1">
                    <span className="text-green-500 font-medium mr-1">
                      {token.yield || "0% APY"}
                    </span>
                    <Sparkle size={14} className="text-amber-500" />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={
                      isDark 
                        ? "border-blue-500/50 text-blue-300 hover:bg-blue-900/30" 
                        : "border-primary/50 text-primary hover:bg-primary/10"
                    }
                    onClick={() => onManageToken(token)}
                  >
                    <Info size={14} className="mr-1" />
                    Manage
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleUnstake(token)}
                  >
                    Unstake
                  </Button>
                </div>
              </div>
            ))}
            
            <div className={`p-3 rounded-lg text-sm ${
              isDark 
                ? "bg-blue-950/30 text-blue-300/80 border border-blue-900/30" 
                : "bg-primary/5 text-muted-foreground border border-primary/10"
            }`}>
              <div className="flex items-start gap-2">
                <ArrowUpRight size={16} className={isDark ? "text-blue-400" : "text-primary"} />
                <div>
                  Your staked tokens are generating both primary yields (from the underlying assets) 
                  and secondary yields (from reinvested income).
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={isDark ? "text-blue-300/80" : "text-muted-foreground"}>
              You have no staked tokens yet.
            </p>
            <Button 
              className={`mt-4 ${
                isDark 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              Buy Tokens
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakedTokensCard;
