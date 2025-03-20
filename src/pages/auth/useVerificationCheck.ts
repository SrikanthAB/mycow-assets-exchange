
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useVerificationCheck() {
  const [error, setError] = useState<string | null>(null);
  const [showResendOption, setShowResendOption] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verificationError = params.get('error_description');
    
    if (verificationError) {
      if (verificationError.includes('Email link is invalid or has expired')) {
        setError('The verification link is invalid or has expired. Please request a new one.');
        setShowResendOption(true);
      } else {
        setError(verificationError);
      }
    }
  }, [location]);

  return { 
    error, 
    setError, 
    showResendOption, 
    setShowResendOption 
  };
}
