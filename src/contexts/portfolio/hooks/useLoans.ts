
import { useState, useEffect } from "react";
import { Loan } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useLoans = (
  addTransaction: (transaction: any) => void,
  lockToken: (id: string, amount: number, loanId: string) => void,
  unlockToken: (id: string) => void,
  addFunds: (amount: number) => void,
  deductFunds: (amount: number) => boolean,
  getTokenByLoanId: (loanId: string) => any
) => {
  // Initialize with an empty loans array
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const { toast } = useToast();

  // Load existing loans when component mounts
  useEffect(() => {
    const loadLoans = async () => {
      try {
        setIsLoading(true);
        console.log("Starting to load loans data");
        
        // Get the current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found, not loading loans");
          setIsLoading(false);
          return;
        }

        console.log(`Loading loans for user: ${user.id}`);
        // Look for loans in local storage first
        const storedLoans = localStorage.getItem(`loans_${user.id}`);
        if (storedLoans) {
          try {
            const parsedLoans = JSON.parse(storedLoans);
            if (Array.isArray(parsedLoans)) {
              setLoans(parsedLoans);
              console.log("Loaded loans from local storage:", parsedLoans);
            }
          } catch (error) {
            console.error("Error parsing stored loans:", error);
            // Initialize with empty array if there's an error
            setLoans([]);
            localStorage.setItem(`loans_${user.id}`, JSON.stringify([]));
          }
        } else {
          console.log("No stored loans found for user", user.id);
          // Initialize with empty array if no loans found
          setLoans([]);
          localStorage.setItem(`loans_${user.id}`, JSON.stringify([]));
        }

        setIsLoading(false);
        console.log("Finished loading loans data, isLoading set to false");
      } catch (error) {
        console.error("Error loading loans:", error);
        setIsLoading(false);
      }
    };

    loadLoans();
  }, []);

  // Helper function to save loans to local storage
  const saveLoansToStorage = async (updatedLoans: Loan[]) => {
    try {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        localStorage.setItem(`loans_${user.id}`, JSON.stringify(updatedLoans));
        console.log("Saved loans to local storage:", updatedLoans);
      }
    } catch (error) {
      console.error("Error saving loans to storage:", error);
    }
  };

  // Add a new loan
  const addLoan = (loan: Omit<Loan, 'id'>) => {
    console.log("Adding new loan:", loan);
    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString(),
    };
    
    const updatedLoans = [...loans, newLoan];
    setLoans(updatedLoans);
    saveLoansToStorage(updatedLoans);
    
    // Lock the collateral token
    lockToken(loan.collateralToken, loan.collateralAmount, newLoan.id);
    
    // Add funds to wallet
    addFunds(loan.amount);
    
    // Add loan transaction
    addTransaction({
      type: 'loan',
      asset: loan.collateralToken, // The token name will be resolved in the provider
      amount: loan.collateralAmount,
      value: loan.amount,
      status: 'completed'
    });
    
    // Add lock collateral transaction
    addTransaction({
      type: 'lock',
      asset: loan.collateralToken, // The token name will be resolved in the provider
      amount: loan.collateralAmount,
      value: loan.collateralValue,
      status: 'completed'
    });

    toast({
      title: "Loan Created Successfully",
      description: `You have successfully taken a loan of ₹${loan.amount.toLocaleString('en-IN')}`,
    });
    
    return newLoan;
  };

  // Repay a loan
  const repayLoan = async (id: string) => {
    console.log("Repaying loan with ID:", id);
    const loan = loans.find(loan => loan.id === id);
    
    if (!loan) {
      console.error("Loan not found for ID:", id);
      return;
    }
    
    // Deduct funds from wallet
    if (!deductFunds(loan.amount)) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough funds to repay this loan.",
        variant: "destructive"
      });
      return;
    }
    
    // Update loan status
    const updatedLoans = loans.map(l => 
      l.id === id 
        ? { ...l, status: 'repaid' as const } 
        : l
    );
    
    setLoans(updatedLoans);
    saveLoansToStorage(updatedLoans);
    
    // Find and unlock the token
    const lockedToken = getTokenByLoanId(id);
    
    if (lockedToken) {
      unlockToken(lockedToken.id);
      
      // Add repayment transaction
      addTransaction({
        type: 'repayment',
        asset: lockedToken.name,
        amount: loan.amount,
        value: loan.amount,
        status: 'completed'
      });
      
      // Add unlock transaction
      addTransaction({
        type: 'unlock',
        asset: lockedToken.name,
        amount: lockedToken.lockedAmount || 0,
        value: (lockedToken.lockedAmount || 0) * lockedToken.price,
        status: 'completed'
      });

      toast({
        title: "Loan Repaid Successfully",
        description: "Your loan has been repaid and your collateral is now unlocked.",
      });
    } else {
      console.error("Could not find locked token for loan ID:", id);
    }
  };

  return {
    loans,
    addLoan,
    repayLoan,
    isLoading
  };
};
