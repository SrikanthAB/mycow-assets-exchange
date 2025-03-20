
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}
