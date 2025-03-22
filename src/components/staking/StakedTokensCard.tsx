
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Token } from "@/contexts/portfolio";

interface StakedTokensCardProps {
  stakedTokens: Token[];
  onManageToken: (token: Token) => void;
}

const StakedTokensCard = ({ stakedTokens, onManageToken }: StakedTokensCardProps) => {
  return (
    <Card className="bg-[#0f172a] border-blue-900/50 text-white">
      <CardHeader>
        <CardTitle className="text-white">Your Staked Tokens</CardTitle>
        <CardDescription className="text-blue-300/80">
          Tokens generating yield in your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stakedTokens.length > 0 ? (
          <div className="space-y-4">
            {stakedTokens.map(token => (
              <div key={token.id} className="flex items-center justify-between p-4 bg-[#1e293b] border border-blue-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white">
                    {token.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{token.name}</h4>
                    <div className="flex items-center text-sm">
                      <Badge variant="secondary" className="mr-2 bg-blue-800/50 text-blue-300">{token.category}</Badge>
                      <span className="text-blue-300/80">{token.symbol}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-white">{token.balance} tokens</div>
                  <div className="text-sm text-green-500">{token.yield}</div>
                </div>
                
                <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-900/30">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-blue-300/80">You have no staked tokens yet.</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Buy Tokens</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakedTokensCard;
