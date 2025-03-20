
import { LoginForm } from "./auth/LoginForm";
import { useVerificationCheck } from "./auth/useVerificationCheck";

const Login = () => {
  const { error, setError, showResendOption, setShowResendOption } = useVerificationCheck();

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background rounded-xl border border-border shadow-sm p-8">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-semibold">
            Welcome to MyCow Exchange
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm 
          error={error}
          setError={setError}
          showResendOption={showResendOption}
          setShowResendOption={setShowResendOption}
        />
      </div>
    </div>
  );
};

export default Login;
