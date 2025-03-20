
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "./AuthContext";
import { authService } from "./authService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a access_token or refresh_token in the URL
    // This happens when users click on the confirmation link in their email
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      
      if (hash && (hash.includes('access_token') || hash.includes('refresh_token'))) {
        // The presence of these tokens means the email confirmation was successful
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (data?.session) {
            toast({
              title: "Email verified successfully",
              description: "Your email has been verified and you're now logged in.",
            });
            navigate('/');
          }
        } catch (error: any) {
          console.error("Email confirmation error:", error);
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: error.message || "There was an error verifying your email.",
          });
        }
      }
    };

    handleEmailConfirmation();

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        } else if (event === 'USER_UPDATED') {
          // This event fires when user details are updated, like email verification
          toast({
            title: "Profile updated",
            description: "Your user profile has been updated.",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Use the authService to handle signup
      const result = await authService.signUp(email, password, fullName);
      
      if (result.success) {
        toast({
          title: "Account created",
          description: "Your account has been created and you're now signed in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during signup.",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        navigate("/");
      } else if (result.emailNotConfirmed) {
        toast({
          variant: "destructive",
          title: "Email not confirmed",
          description: "Please check your email for the confirmation link or resend the confirmation email.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Invalid login credentials.",
      });
      throw error;
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      await authService.resendConfirmationEmail(email);
      
      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to resend confirmation email.",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during sign out.",
      });
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resendConfirmationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
