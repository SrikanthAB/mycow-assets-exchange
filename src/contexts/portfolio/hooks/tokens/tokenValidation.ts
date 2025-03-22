
import { Token } from "../../types";
import { Json } from "@/integrations/supabase/types";

/**
 * Validates that the data has the required Token properties
 * @param data Unknown data to validate as Token array
 * @returns boolean indicating if the data is a valid Token array
 */
export const isValidTokenArray = (data: unknown): boolean => {
  if (!Array.isArray(data)) return false;
  
  // Check if each item has the required Token properties
  return data.every(item => 
    typeof item === 'object' && 
    item !== null &&
    'id' in item && 
    'name' in item && 
    'symbol' in item && 
    'category' in item && 
    'price' in item &&
    'priceString' in item &&
    'change' in item &&
    'balance' in item
  );
};

/**
 * Converts JSON data to Token array with proper type checking
 * @param data JSON data from Supabase
 * @returns Token array or null if invalid
 */
export const convertJsonToTokens = (data: Json[] | null): Token[] | null => {
  if (!data) return null;
  
  // First cast to unknown, then to Token[] to satisfy TypeScript
  const tokenArray = data as unknown;
  
  // Validate that the data has the expected structure before returning
  if (isValidTokenArray(tokenArray)) {
    return tokenArray as Token[];
  }
  
  return null;
};
