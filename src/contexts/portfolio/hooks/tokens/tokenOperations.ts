
import { Token } from "../../types";

/**
 * Updates a token's balance by a specified amount
 * @param tokens Current tokens array
 * @param id Token ID to update
 * @param amount Amount to add to the balance (negative to subtract)
 * @returns New tokens array with updated balance
 */
export const updateTokenBalance = (tokens: Token[], id: string, amount: number): Token[] => {
  return tokens.map(token => 
    token.id === id 
      ? { ...token, balance: token.balance + amount } 
      : token
  );
};

/**
 * Locks a token for use as collateral
 * @param tokens Current tokens array
 * @param id Token ID to lock
 * @param amount Amount to lock
 * @param loanId Loan ID that the token is locked for
 * @returns New tokens array with locked token
 */
export const lockToken = (tokens: Token[], id: string, amount: number, loanId: string): Token[] => {
  return tokens.map(token => 
    token.id === id 
      ? { 
          ...token, 
          locked: true, 
          lockedAmount: (token.lockedAmount || 0) + amount,
          loanId: loanId
        } 
      : token
  );
};

/**
 * Unlocks a previously locked token
 * @param tokens Current tokens array
 * @param id Token ID to unlock
 * @returns New tokens array with unlocked token
 */
export const unlockToken = (tokens: Token[], id: string): Token[] => {
  return tokens.map(token => 
    token.id === id 
      ? { 
          ...token, 
          locked: false, 
          lockedAmount: 0,
          loanId: undefined
        } 
      : token
  );
};

/**
 * Gets a token by its associated loan ID
 * @param tokens Current tokens array
 * @param loanId Loan ID to search for
 * @returns Token associated with the loan ID or undefined
 */
export const getTokenByLoanId = (tokens: Token[], loanId: string): Token | undefined => {
  return tokens.find(token => token.loanId === loanId);
};

/**
 * Calculates the total value of the portfolio
 * @param tokens Current tokens array
 * @returns Total value of all tokens
 */
export const getTotalPortfolioValue = (tokens: Token[]): number => {
  return tokens.reduce((total, token) => total + (token.price * token.balance), 0);
};

/**
 * Calculates the available value of the portfolio (excluding locked tokens)
 * @param tokens Current tokens array
 * @returns Available value of unlocked tokens
 */
export const getAvailablePortfolioValue = (tokens: Token[]): number => {
  return tokens.reduce((total, token) => {
    if (token.locked && token.lockedAmount) {
      const availableBalance = token.balance - token.lockedAmount;
      return total + (token.price * Math.max(0, availableBalance));
    }
    return total + (token.price * token.balance);
  }, 0);
};

/**
 * Toggles the staking status of a token
 * @param tokens Current tokens array
 * @param id Token ID to toggle staking
 * @param isStaked Whether the token should be staked
 * @param yieldRate Optional yield rate to set
 * @returns New tokens array with updated staking status
 */
export const toggleTokenStaking = (tokens: Token[], id: string, isStaked: boolean, yieldRate?: string): Token[] => {
  return tokens.map(token => 
    token.id === id 
      ? { 
          ...token, 
          staked: isStaked,
          yield: isStaked ? (yieldRate || token.yield || "5% APY") : undefined
        } 
      : token
  );
};
