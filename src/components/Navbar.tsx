
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Moon as MoonIcon, Sun as SunIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/components/ui/theme-provider";
import UserProfileModal from "./UserProfileModal";
import SupportChatbot from "./SupportChatbot";

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
  const { user, signOut } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };
  
  const handleLogout = () => {
    if (signOut) {
      signOut();
    }
  };
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggling theme to:", newTheme);
    setTheme(newTheme);
  };
  
  const openProfileModal = () => {
    if (user) {
      setIsProfileModalOpen(true);
    }
  };
  
  const openSupportChat = () => {
    setIsSupportChatOpen(true);
  };
  
  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={openProfileModal}
            >
              <img 
                src="/lovable-uploads/2357ba2d-c9c0-46f4-8848-6384dd15da4b.png" 
                alt="MyCow Logo" 
                className="h-8 w-auto mr-2" 
              />
              <span className="font-semibold text-xl">MyCow</span>
            </div>
            
            <nav className="hidden md:flex items-center ml-8 space-x-6">
              <HeaderLink to="/">Home</HeaderLink>
              <HeaderLink to="/markets">Markets</HeaderLink>
              <HeaderLink to="/overview">Overview</HeaderLink>
              <HeaderLink to="/swaps">Swaps</HeaderLink>
              <HeaderLink to="/ibpls">IBPLs</HeaderLink>
              <HeaderLink to="/staking">Staking</HeaderLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <SunIcon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={openSupportChat}
                  aria-label="Support"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Support</span>
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
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
            <HeaderLink to="/overview">Overview</HeaderLink>
            <HeaderLink to="/swaps">Swaps</HeaderLink>
            <HeaderLink to="/ibpls">IBPLs</HeaderLink>
            <HeaderLink to="/staking">Staking</HeaderLink>
            
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={openSupportChat}
                  className="flex items-center justify-start"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Support
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
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
      
      {/* User Profile Modal */}
      <UserProfileModal 
        open={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      
      {/* Support Chatbot */}
      <SupportChatbot
        open={isSupportChatOpen}
        onClose={() => setIsSupportChatOpen(false)}
      />
    </header>
  );
};

export default Navbar;
