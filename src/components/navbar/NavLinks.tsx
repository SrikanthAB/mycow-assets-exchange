
import React from "react";
import HeaderLink from "./HeaderLink";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NavLinks: React.FC = () => {
  const navigate = useNavigate();
  
  const handleComingSoon = (e: React.MouseEvent, pageName: string) => {
    e.preventDefault();
    toast(`The ${pageName} page is under development and will be available soon.`);
  };
  
  return (
    <nav className="hidden md:flex items-center ml-8 space-x-6">
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/markets">Markets</HeaderLink>
      <HeaderLink to="/overview">Overview</HeaderLink>
      <HeaderLink to="/staking">Staking</HeaderLink>
      <HeaderLink to="/swaps">Swaps</HeaderLink>
      <HeaderLink to="/ibpls">IBPLs</HeaderLink>
    </nav>
  );
};

export default NavLinks;
