
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "./AuthContext";
import { authService } from "./authService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
  }, [toast]);

  const value = {
    session,
    user,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut,
    resendConfirmationEmail: authService.resendConfirmationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
