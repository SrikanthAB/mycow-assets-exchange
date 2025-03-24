
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export function AuthNavigationHandler() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);
  const lastAuthStateRef = useRef<boolean | null>(null);

  useEffect(() => {
    // Skip during initial loading
    if (loading) return;
    
    // Skip if nothing has changed
    const currentPath = location.pathname;
    const isAuthenticated = !!user;
    
    if (
      currentPath === lastPathRef.current && 
      isAuthenticated === lastAuthStateRef.current
    ) {
      return;
    }
    
    // Update refs
    lastPathRef.current = currentPath;
    lastAuthStateRef.current = isAuthenticated;

    // Handle navigation based on authentication state
    if (user) {
      // If user is logged in and on auth pages, redirect to home/overview
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/overview');
      }
    } else {
      // If user is not logged in and on protected routes, redirect to login
      const protectedRoutes = ['/overview', '/swaps', '/ibpls'];
      if (protectedRoutes.includes(location.pathname)) {
        navigate('/login');
      }
    }
  }, [user, loading, navigate, location.pathname]);

  // This component doesn't render anything
  return null;
}
