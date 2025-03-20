
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import Assets from "./pages/Assets";
import Swaps from "./pages/Swaps";
import IBPLs from "./pages/IBPLs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PortfolioProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
              <Route path="/swaps" element={<ProtectedRoute><Swaps /></ProtectedRoute>} />
              <Route path="/staking" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/ibpls" element={<ProtectedRoute><IBPLs /></ProtectedRoute>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PortfolioProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
