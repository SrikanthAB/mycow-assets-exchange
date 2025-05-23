
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Sparkle, ArrowUpRight, LineChart, BarChart3, Zap } from "lucide-react";

interface YieldInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const YieldInfoModal = ({ open, onOpenChange }: YieldInfoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkle className="h-5 w-5 text-primary" />
            Understanding Yields in Tokenized RWAs
          </DialogTitle>
          <DialogDescription>
            Learn how yields work and how to maximize your returns through yield stacking strategies.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Primary Yield Section */}
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex gap-3">
              <div className="p-2 bg-primary/10 rounded-full h-fit">
                <LineChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Primary Yields</h3>
                <p className="text-muted-foreground mb-3">
                  Primary yields are the direct returns generated from the underlying real-world assets (RWAs). For example:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Rental income from real estate tokens</li>
                  <li>Royalty payments from entertainment rights</li>
                  <li>Interest from private credit</li>
                  <li>Dividend distributions from business assets</li>
                </ul>
                <div className="mt-4 text-sm flex items-center gap-1 text-primary">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Typical range: 5-12% APY</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Secondary Yield Section */}
          <Card className="p-4 border-amber-600/20 bg-amber-600/5">
            <div className="flex gap-3">
              <div className="p-2 bg-amber-600/10 rounded-full h-fit">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Secondary Yields</h3>
                <p className="text-muted-foreground mb-3">
                  Secondary yields are generated by reinvesting your primary yields into other yield-bearing assets or strategies:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Redirecting rental income to high-yield private credit</li>
                  <li>Using dividends to purchase more tokenized assets</li>
                  <li>Leveraging yield to participate in senior tranches</li>
                </ul>
                <div className="mt-4 text-sm flex items-center gap-1 text-amber-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Typical range: 8-20% APY on reinvested yields</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Compound Effect Section */}
          <Card className="p-4 border-purple-600/20 bg-purple-600/5">
            <div className="flex gap-3">
              <div className="p-2 bg-purple-600/10 rounded-full h-fit">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">The Compound Effect</h3>
                <p className="text-muted-foreground mb-3">
                  The "Yield on Yield" strategy creates a compounding effect that can significantly enhance your overall returns:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Primary yields generate consistent income from the base assets</li>
                  <li>Secondary yields put that income to work, creating additional returns</li>
                  <li>Over time, this compound growth creates an accelerating return curve</li>
                  <li>Risk is diversified across multiple asset categories and strategies</li>
                </ul>
                <div className="mt-4 text-sm flex items-center gap-1 text-purple-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Potential to increase overall returns by 15-40% annually</span>
                </div>
              </div>
            </div>
          </Card>

          <p className="text-xs text-muted-foreground mt-2">
            Note: All yields are variable and dependent on market conditions, asset performance, and selected strategies. 
            Past performance is not indicative of future results.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YieldInfoModal;
