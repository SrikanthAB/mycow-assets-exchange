
import React from "react";
import HeaderLink from "./HeaderLink";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { User } from "@/contexts/auth/types";

interface MobileNavigationProps {
  isOpen: boolean;
  user: User | null;
  openSupportChat: () => void;
  handleLogout: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  isOpen, 
  user, 
  openSupportChat, 
  handleLogout 
}) => {
  if (!isOpen) return null;
  
  return (
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
              <Bot className="h-4 w-4 mr-2" />
              AI Support
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <HeaderLink to="/login">Login</HeaderLink>
            <HeaderLink to="/register">Sign Up</HeaderLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNavigation;
