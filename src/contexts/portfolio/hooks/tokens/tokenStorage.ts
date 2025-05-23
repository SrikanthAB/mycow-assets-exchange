
import { Token } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { convertJsonToTokens } from "./tokenValidation";

/**
 * Loads tokens from Supabase storage
 * @returns Promise with Token array or null
 */
export const loadTokensFromStorage = async (): Promise<Token[] | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Use raw query to get around type limitations
    const { data, error } = await supabase
      .from('user_portfolio')
      .select('tokens')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      // If no data exists yet, return null
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    // Convert from Json to Token[] with proper type checking
    if (data?.tokens && Array.isArray(data.tokens)) {
      return convertJsonToTokens(data.tokens as Json[]);
    }
    
    return null;
  } catch (error) {
    console.error('Error loading tokens:', error);
    return null;
  }
};

/**
 * Saves tokens to Supabase storage
 * @param tokensToSave Token array to save
 * @returns Promise that resolves when operation is complete
 */
export const saveTokensToStorage = async (tokensToSave: Token[]): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    // Check if user record exists
    const { data, error: selectError } = await supabase
      .from('user_portfolio')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }
    
    // Convert tokens to a format compatible with Supabase's Json type
    const tokensJson = tokensToSave as unknown as Json;
    
    if (data) {
      // Update existing record
      const { error } = await supabase
        .from('user_portfolio')
        .update({ tokens: tokensJson })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_portfolio')
        .insert({ 
          user_id: user.id, 
          tokens: tokensJson 
        });
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};
