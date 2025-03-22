
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

const MobileNavigation: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleComingSoon = (e: React.MouseEvent, pageName: string) => {
    e.preventDefault();
    toast(`The ${pageName} page is under development and will be available soon.`);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/2357ba2d-c9c0-46f4-8848-6384dd15da4b.png" 
                alt="MyCow Logo" 
                className="h-6 w-auto" 
              />
              <span className="font-semibold">MyCow</span>
            </Link>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </SheetTrigger>
          </div>
          
          <nav className="flex flex-col space-y-4 mt-6">
            <Link to="/" className="text-sm font-medium py-2 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/markets" className="text-sm font-medium py-2 hover:text-primary transition-colors">
              Markets
            </Link>
            <Link to="/overview" className="text-sm font-medium py-2 hover:text-primary transition-colors">
              Overview
            </Link>
            <Link to="/staking" className="text-sm font-medium py-2 hover:text-primary transition-colors">
              Staking
            </Link>
            <Link to="/swaps" className="text-sm font-medium py-2 hover:text-primary transition-colors">
              Swaps
            </Link>
            <Link to="/ibpls" className="text-sm font-medium py-2 hover:text-primary transition-colors">
              IBPLs
            </Link>
          </nav>
        </div>
        
        <div className="mt-auto pt-6 border-t border-border">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start pl-2 text-sm text-destructive"
                onClick={signOut}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
