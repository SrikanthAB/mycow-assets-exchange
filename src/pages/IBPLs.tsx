
import { useState, FormEvent, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";
import { useToast } from "@/components/ui/use-toast";
import LoanApplication from "@/components/ibpls/LoanApplication";
import ActiveLoans from "@/components/ibpls/ActiveLoans";
import RepayLoanDialog from "@/components/ibpls/RepayLoanDialog";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const IBPLs = () => {
  const { tokens, getTotalPortfolioValue, getAvailablePortfolioValue, addLoan, repayLoan, loans, walletBalance, isLoading } = usePortfolio();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [authChecking, setAuthChecking] = useState(true);
  const [repayDialogOpen, setRepayDialogOpen] = useState<boolean>(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string>("");
  const [forceRender, setForceRender] = useState(false);
  
  // Force a re-render after initial mount to ensure we have the latest data
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceRender(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Make sure portfolio data is loaded
  useEffect(() => {
    console.log("IBPLs component mounted or updated, tokens:", tokens.length);
    console.log("Loans data:", loans);
    console.log("Loading state:", isLoading);
  }, [tokens, loans, isLoading, forceRender]);
  
  // Calculate already used collateral value - add defensive coding
  const usedCollateralValue = loans
    .filter(loan => loan.status === 'active')
    .reduce((total, loan) => total + (loan.collateralValue || 0), 0);
  
  // Calculate available portfolio value by subtracting used collateral
  // Add safety checks to prevent null/undefined values
  const portfolioValue = getAvailablePortfolioValue() || 0;
  const availablePortfolioValue = Math.max(0, portfolioValue - usedCollateralValue);
  
  // Max loan amount should be 66% of available portfolio value
  const maxLoanAmount = availablePortfolioValue * 0.66;
  
  // Load user data on initial mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        console.log("Auth check result:", data.user ? "User found" : "No user");
        if (!data.user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access Investment-Backed Loans.",
            variant: "destructive"
          });
        }
        setAuthChecking(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [toast]);
  
  // Calculate repayment amount for a loan (principal only for simplicity)
  const getRepaymentAmount = (loanId: string) => {
    const loan = loans.find(loan => loan.id === loanId);
    return loan ? loan.amount : 0;
  };
  
  const handleOpenRepayDialog = (loanId: string) => {
    setSelectedLoanId(loanId);
    setRepayDialogOpen(true);
  };
  
  const handleRepayLoan = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId) return;
    
    const repaymentAmount = getRepaymentAmount(selectedLoanId);
    
    if (walletBalance < repaymentAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${repaymentAmount.toLocaleString('en-IN')} to repay this loan. Your wallet balance is ₹${walletBalance.toLocaleString('en-IN')}.`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Process loan repayment
      await repayLoan(selectedLoanId);
      
      toast({
        title: "Loan Repaid Successfully",
        description: `Your loan has been repaid and the collateral has been unlocked.`,
      });
    } catch (error) {
      console.error("Error repaying loan:", error);
      toast({
        title: "Error Repaying Loan",
        description: "There was an error processing your loan repayment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRepayDialogOpen(false);
    }
  };
  
  // Show loading state if still checking auth
  if (authChecking) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-[500px] rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-[200px] rounded-xl mb-6" />
                <Skeleton className="h-[250px] rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Debug information
  console.log("Rendering IBPLs with data:", {
    tokenCount: tokens.length,
    loansCount: loans.length,
    walletBalance,
    isLoading,
    forceRender
  });
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2 className="text-2xl font-bold">Investment-Backed Loans</h2>
              <p className="mt-3 text-muted-foreground">
                Access liquidity through over-collateralized loans without triggering capital gains taxes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* New Loan Application */}
              <LoanApplication 
                tokens={tokens}
                availablePortfolioValue={availablePortfolioValue}
                maxLoanAmount={maxLoanAmount}
                addLoan={addLoan}
              />
              
              {/* Active Loans */}
              <ActiveLoans 
                loans={loans}
                tokens={tokens}
                onRepayLoan={handleOpenRepayDialog}
              />
            </div>
          </div>
        </section>
      </main>
      
      <RepayLoanDialog 
        open={repayDialogOpen}
        onOpenChange={setRepayDialogOpen}
        repaymentAmount={getRepaymentAmount(selectedLoanId)}
        walletBalance={walletBalance}
        onRepay={handleRepayLoan}
      />
      
      <Footer />
    </div>
  );
};

export default IBPLs;
