
import React from "react";
import HeaderLink from "./HeaderLink";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NavLinks: React.FC = () => {
  const navigate = useNavigate();
  
  const handleComingSoon = (e: React.MouseEvent, pageName: string) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: `The ${pageName} page is under development and will be available soon.`,
    });
  };
  
  return (
    <nav className="hidden md:flex items-center ml-8 space-x-6">
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/markets">Markets</HeaderLink>
      <a 
        href="#" 
        className="text-sm font-medium hover:text-primary transition-colors"
        onClick={(e) => handleComingSoon(e, "MyCow Layer 1")}
      >
        MyCow Layer 1
      </a>
      <a 
        href="#" 
        className="text-sm font-medium hover:text-primary transition-colors"
        onClick={(e) => handleComingSoon(e, "MyCow RWA's")}
      >
        MyCow RWA's
      </a>
      <a 
        href="#" 
        className="text-sm font-medium hover:text-primary transition-colors"
        onClick={(e) => handleComingSoon(e, "MyCow Exchange")}
      >
        MyCow Exchange
      </a>
      <a 
        href="#" 
        className="text-sm font-medium hover:text-primary transition-colors"
        onClick={(e) => handleComingSoon(e, "MyCow Stable Coin")}
      >
        MyCow Stable Coin
      </a>
    </nav>
  );
};

export default NavLinks;
