
import React from "react";
import HeaderLink from "./HeaderLink";

const NavLinks: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center ml-8 space-x-6">
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/markets">Markets</HeaderLink>
      <HeaderLink to="/overview">Overview</HeaderLink>
      <HeaderLink to="/swaps">Swaps</HeaderLink>
      <HeaderLink to="/ibpls">IBPLs</HeaderLink>
      <HeaderLink to="/staking">Staking</HeaderLink>
    </nav>
  );
};

export default NavLinks;
