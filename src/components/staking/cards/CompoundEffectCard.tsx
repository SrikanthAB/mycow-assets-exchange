
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/ui/theme-provider";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface CompoundEffectCardProps {
  totalAnnualYield: number;
  combinedYieldRate: number;
  annualPrimaryYield: number;
  annualSecondaryYield: number;
  primaryYield: number;
  secondaryYield: number;
}

const CompoundEffectCard = ({ 
  totalAnnualYield, 
  combinedYieldRate, 
  annualPrimaryYield, 
  annualSecondaryYield,
  primaryYield,
  secondaryYield
}: CompoundEffectCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={isDark ? "border-blue-900/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className={isDark ? "text-purple-400" : "text-purple-600"} />
          <CardTitle className="text-lg">Compound Effect</CardTitle>
        </div>
        <CardDescription>
          Extra growth from Yield-on-Yield
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
          ₹{totalAnnualYield.toLocaleString('en-IN', {maximumFractionDigits: 2})}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Combined yield at {combinedYieldRate.toFixed(1)}% effective APY
        </div>
        
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Primary yield:</span>
            <span className="font-medium text-green-600">₹{annualPrimaryYield.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Secondary yield:</span>
            <span className="font-medium text-amber-600">₹{annualSecondaryYield.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
          </div>
          
          <div className="mt-2 pt-2 border-t flex items-center gap-1 text-xs">
            <ArrowUpRight size={14} className="text-purple-500" />
            <span className="text-purple-600">
              {((secondaryYield / primaryYield) * 100).toFixed(0)}% boost with Yield-on-Yield strategy
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompoundEffectCard;
