
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log("ProtectedRoute - Auth state:", { user, loading });

  useEffect(() => {
    if (!loading && !user) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show a loading indicator while checking authentication
  if (loading) {
    console.log("Auth is loading, showing spinner");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, render the child routes
  console.log("Auth check passed, rendering child routes");
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
