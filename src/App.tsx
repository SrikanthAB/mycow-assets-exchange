import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster"

// Import layouts
import HomeLayout from './layouts/HomeLayout';
import MainLayout from './layouts/MainLayout';

// Import pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Markets from './pages/Markets';
import Overview from './pages/Overview';
import Swaps from './pages/Swaps';
import IBPLs from './pages/IBPLs';
import NotFound from './pages/NotFound';
import Staking from './pages/Staking';
import Funding from './pages/Funding';

// Import contexts
import { AuthProvider } from './contexts/auth';
import { PortfolioProvider } from './contexts/portfolio';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  console.log("Rendering App component");
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="mycow-theme-preference">
          <AuthProvider>
            <PortfolioProvider>
              <Routes>
                {/* Home route with Footer */}
                <Route element={<HomeLayout />}>
                  <Route path="/" element={<Index />} />
                </Route>
                
                {/* Other routes without Footer */}
                <Route element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/staking" element={<Staking />} />
                  <Route path="/funding" element={<Funding />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/swaps" element={<Swaps />} />
                    <Route path="/ibpls" element={<IBPLs />} />
                  </Route>
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
            </PortfolioProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
