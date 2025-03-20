
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { loginSchema, LoginFormValues } from "./login-schema";
import { useAuth } from "@/contexts/auth";

interface LoginFormProps {
  error: string | null;
  setError: (error: string | null) => void;
  showResendOption: boolean;
  setShowResendOption: (show: boolean) => void;
}

export const LoginForm = ({
  error,
  setError,
  showResendOption,
  setShowResendOption,
}: LoginFormProps) => {
  const { signIn, resendConfirmationEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setShowResendOption(false);
    
    try {
      await signIn(data.email, data.password);
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
      if (err.message?.includes("not confirmed")) {
        setShowResendOption(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    const email = form.getValues("email");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address to resend the confirmation");
      return;
    }

    setIsResending(true);
    try {
      await resendConfirmationEmail(email);
    } catch (err: any) {
      setError(err.message || "Failed to resend confirmation email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showResendOption && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResendConfirmation}
            disabled={isResending}
            className="mx-auto flex items-center gap-2"
          >
            {isResending ? "Sending..." : "Resend confirmation email"}
            <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
          </Button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Your email"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Your password"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full button-effect"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};
