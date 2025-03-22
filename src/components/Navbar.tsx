
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import UserProfileModal from "./UserProfileModal";
import SupportChatbot from "./SupportChatbot";

// Import our new components
import HeaderLink from "./navbar/HeaderLink";
import ThemeToggle from "./navbar/ThemeToggle";
import SupportChatButton from "./navbar/SupportChatButton";
import MobileNavigation from "./navbar/MobileNavigation";
import NavLinks from "./navbar/NavLinks";

const Navbar = () => {
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
            
            <NavLinks />
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <>
                <SupportChatButton onClick={openSupportChat} />
                
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
      
      <MobileNavigation 
        isOpen={isMobileNavOpen}
        user={user}
        openSupportChat={openSupportChat}
        handleLogout={handleLogout}
      />
      
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
