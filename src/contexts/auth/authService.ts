
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AuthResult {
  success: boolean;
  emailNotConfirmed?: boolean;
  error?: string;
}

export const authService = {
  signUp: async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    try {
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
        
        toast.success("Account created successfully!");
        return { success: true };
      }
      
      return { success: false, error: "Failed to create account" };
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      toast.error(error.message || "Failed to create account");
      return { success: false, error: error.message };
    }
  },
  
  signIn: async (email: string, password: string): Promise<AuthResult> => {
    try {
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
      
      toast.success("Signed in successfully!");
      return { success: true };
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      toast.error(error.message || "Failed to sign in");
      return { success: false, error: error.message };
    }
  },
  
  resendConfirmationEmail: async (email: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (error) throw error;
      
      toast.success("Confirmation email sent. Please check your inbox.");
      return { success: true };
    } catch (error: any) {
      console.error("Email resend error:", error.message);
      toast.error(error.message || "Failed to resend confirmation email");
      return { success: false, error: error.message };
    }
  },
  
  signOut: async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      return { success: true };
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast.error(error.message || "Failed to sign out");
      return { success: false, error: error.message };
    }
  }
};
