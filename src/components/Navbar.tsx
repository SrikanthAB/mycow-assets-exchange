import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ui/use-theme";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderLinkProps {
  to: string;
  children: React.ReactNode;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ to, children }) => {
  return (
    <Link to={to} className="text-sm font-medium hover:text-primary transition-colors">
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };
  
  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-mycow-500 text-white rounded-lg flex items-center justify-center mr-2">
                <span className="text-lg font-bold">M</span>
              </div>
              <span className="font-semibold text-xl">MyCow</span>
            </Link>
            
            <nav className="hidden md:flex items-center ml-8 space-x-6">
              <HeaderLink to="/">Home</HeaderLink>
              <HeaderLink to="/markets">Markets</HeaderLink>
              <HeaderLink to="/assets">Assets</HeaderLink>
              <HeaderLink to="/swaps">Swaps</HeaderLink>
              <HeaderLink to="/ibpls">IBPLs</HeaderLink>
              <HeaderLink to="/staking">Staking</HeaderLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {user ? (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            
            <button className="md:hidden" onClick={toggleMobileNav}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12A.75.75 0 013.75 11.25h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMobileNavOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="flex flex-col p-4 space-y-3">
            <HeaderLink to="/">Home</HeaderLink>
            <HeaderLink to="/markets">Markets</HeaderLink>
            <HeaderLink to="/assets">Assets</HeaderLink>
            <HeaderLink to="/swaps">Swaps</HeaderLink>
            <HeaderLink to="/ibpls">IBPLs</HeaderLink>
            <HeaderLink to="/staking">Staking</HeaderLink>
            
            {user ? (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
