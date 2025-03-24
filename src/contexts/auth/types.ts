
import { Session, User } from "@supabase/supabase-js";

export interface AuthResult {
  success: boolean;
  emailNotConfirmed?: boolean;
  error?: string;
}

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resendConfirmationEmail: (email: string) => Promise<AuthResult>;
};
