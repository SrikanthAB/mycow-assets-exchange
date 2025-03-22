
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface RepayLoanDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  repaymentAmount: number;
  walletBalance: number;
  onRepay: (e: FormEvent) => void;
}

const RepayLoanDialog = ({ 
  open, 
  onOpenChange, 
  repaymentAmount, 
  walletBalance, 
  onRepay 
}: RepayLoanDialogProps) => {
  const { theme } = useTheme();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : ''}`}>
        <DialogHeader>
          <DialogTitle>Repay Loan</DialogTitle>
          <DialogDescription>
            Are you sure you want to repay this loan? The full amount will be deducted from your wallet balance.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Repayment Amount</span>
            <span className="font-medium">₹{repaymentAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your Wallet Balance</span>
            <span className="font-medium">₹{walletBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            className={`${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' : ''}`} 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className={`${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' : ''}`}
            onClick={onRepay}
          >
            Repay Loan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RepayLoanDialog;
