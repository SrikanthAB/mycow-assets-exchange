
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Coins, ArrowLeftRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Markets",
      icon: TrendingUp,
      path: "/markets"
    },
    {
      name: "Overview",
      icon: LayoutDashboard,
      path: "/overview"
    },
    {
      name: "Staking",
      icon: Coins,
      path: "/staking"
    },
    {
      name: "Swaps",
      icon: ArrowLeftRight,
      path: "/swaps"
    },
    {
      name: "IBPLs",
      icon: FileText,
      path: "/ibpls"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border h-16 md:hidden">
      <div className="grid grid-cols-5 h-full">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center h-full px-1 transition-colors",
              currentPath === item.path 
                ? "text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
