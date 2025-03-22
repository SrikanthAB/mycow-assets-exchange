
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/ui/theme-provider";
import { ArrowUpRight } from "lucide-react";

interface PrimaryYieldCardProps {
  annualPrimaryYield: number;
  primaryYield: number;
}

const PrimaryYieldCard = ({ annualPrimaryYield, primaryYield }: PrimaryYieldCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={isDark ? "border-blue-900/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ArrowUpRight size={18} className={isDark ? "text-green-400" : "text-green-600"} />
          <CardTitle className="text-lg">Primary Yield</CardTitle>
        </div>
        <CardDescription>
          Direct rental income from your assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold text-green-600 ${isDark ? "text-green-400" : ""}`}>
          ₹{annualPrimaryYield.toLocaleString('en-IN', {maximumFractionDigits: 2})}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Annual income at {(primaryYield * 100).toFixed(1)}% APY
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span>Monthly income:</span>
            <span className="font-medium">₹{(annualPrimaryYield / 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span>Quarterly income:</span>
            <span className="font-medium">₹{(annualPrimaryYield / 4).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrimaryYieldCard;
