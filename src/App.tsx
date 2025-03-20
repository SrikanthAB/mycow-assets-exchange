
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster"

// Import pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Markets from './pages/Markets';
import Assets from './pages/Assets';
import Swaps from './pages/Swaps';
import IBPLs from './pages/IBPLs';
import NotFound from './pages/NotFound';
import Staking from './pages/Staking';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider } from './contexts/PortfolioContext';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PortfolioProvider>
          <ThemeProvider defaultTheme="dark" storageKey="theme-preference">
            <BrowserRouter>
              <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/staking" element={<Staking />} />
                  
                  {/* Protected Routes */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <Outlet />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/swaps" element={<Swaps />} />
                    <Route path="/ibpls" element={<IBPLs />} />
                  </Route>
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </BrowserRouter>
          </ThemeProvider>
        </PortfolioProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
