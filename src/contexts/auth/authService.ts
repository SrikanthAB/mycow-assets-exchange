
import { supabase } from "@/integrations/supabase/client";

export interface AuthResult {
  success: boolean;
  emailNotConfirmed?: boolean;
  error?: string;
}

export const authService = {
  signUp: async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}`,
      },
    });

    if (error) throw error;
    
    // If account was created successfully, immediately sign in the user
    if (data?.user) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      return { success: true };
    }
    
    return { success: false, error: "Failed to create account" };
  },
  
  signIn: async (email: string, password: string): Promise<AuthResult> => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        return { success: false, emailNotConfirmed: true };
      }
      throw error;
    }
    
    return { success: true };
  },
  
  resendConfirmationEmail: async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    });

    if (error) throw error;
    
    return { success: true };
  },
  
  signOut: async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { success: true };
  }
};
