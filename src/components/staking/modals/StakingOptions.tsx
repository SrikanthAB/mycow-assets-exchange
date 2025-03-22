
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface StakingOptionsProps {
  autoCompound: boolean;
  setAutoCompound: (value: boolean) => void;
  yieldRedirect: boolean;
  setYieldRedirect: (value: boolean) => void;
  strategy?: {
    id: string;
    name: string;
    description: string;
    expectedReturn: string;
    assets: string[];
    risk: string;
  };
  currentYield: number;
  compoundBenefit: number;
}

const StakingOptions = ({
  autoCompound,
  setAutoCompound,
  yieldRedirect,
  setYieldRedirect,
  strategy,
  currentYield,
  compoundBenefit
}: StakingOptionsProps) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="auto-compound" className="flex flex-col">
          <span>Auto-Compound Rewards</span>
          <span className="font-normal text-xs text-muted-foreground">Automatically reinvest yield into the same token</span>
        </Label>
        <Switch
          id="auto-compound"
          checked={autoCompound}
          onCheckedChange={setAutoCompound}
        />
      </div>
      
      {strategy && (
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="yield-redirect" className="flex flex-col">
            <span>Redirect Yield to {strategy.name} Strategy</span>
            <span className="font-normal text-xs text-muted-foreground">Invest yield into {strategy.name.toLowerCase()} risk assets</span>
          </Label>
          <Switch
            id="yield-redirect"
            checked={yieldRedirect}
            onCheckedChange={setYieldRedirect}
          />
        </div>
      )}

      {yieldRedirect && strategy && (
        <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
          <h4 className="text-sm font-medium flex items-center">
            <span>Current Yield</span>
            <ArrowRight className="mx-2 h-3 w-3" />
            <span>{strategy.name} Strategy</span>
          </h4>
          <div className="mt-2 text-sm flex justify-between">
            <span>{currentYield}% APY</span>
            <span className="text-primary">{strategy.expectedReturn}</span>
          </div>
          <div className="mt-2 text-xs bg-primary/10 text-primary p-2 rounded">
            Potential yield increase: +{compoundBenefit.toFixed(1)}% APY
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingOptions;
