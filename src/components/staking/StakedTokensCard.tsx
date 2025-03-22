
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
    <Card>
      <CardHeader>
        <CardTitle>Your Staked Tokens</CardTitle>
        <CardDescription>
          Tokens generating yield in your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stakedTokens.length > 0 ? (
          <div className="space-y-4">
            {stakedTokens.map(token => (
              <div key={token.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {token.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-medium">{token.name}</h4>
                    <div className="flex items-center text-sm">
                      <Badge variant="secondary" className="mr-2">{token.category}</Badge>
                      <span className="text-muted-foreground">{token.symbol}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{token.balance} tokens</div>
                  <div className="text-sm text-green-600">{token.yield}</div>
                </div>
                
                <Button size="sm" variant="outline" onClick={() => onManageToken(token)}>
                  Manage
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You have no staked tokens yet.</p>
            <Button className="mt-4">Buy Tokens</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakedTokensCard;
