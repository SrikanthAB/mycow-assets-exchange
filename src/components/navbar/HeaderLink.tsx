
import React from "react";
import { Link } from "react-router-dom";

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

export default HeaderLink;
