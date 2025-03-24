
import { Token } from '../types';

export const useEnhancedTransactions = (
  tokens: Token[],
  addTransaction: (transaction: any) => Promise<any>,
  saveTokensToStorage: (tokens: Token[]) => Promise<void>,
  saveWalletBalance: (balance: number) => Promise<void>,
  walletBalance: number
) => {
  // Enhance transaction with token name resolution
  const enhancedAddTransaction = async (transaction: any) => {
    try {
      // Resolve token name from ID if needed
      if (transaction.asset && !transaction.asset.includes(' ')) {
        const token = tokens.find(t => t.id === transaction.asset);
        if (token) {
          transaction = {
            ...transaction,
            asset: token.name
          };
        }
      }
      
      // Add transaction to history
      const savedTransaction = await addTransaction(transaction);
      
      // Save tokens and wallet balance after transaction is added
      await saveTokensToStorage(tokens);
      await saveWalletBalance(walletBalance);
      
      return savedTransaction;
    } catch (error) {
      console.error("Error in enhancedAddTransaction:", error);
      throw error;
    }
  };

  return {
    enhancedAddTransaction
  };
};
