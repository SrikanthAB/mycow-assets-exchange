
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LogIn, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Markets", path: "/markets" },
    { title: "Assets", path: "/assets" },
    { title: "Swaps", path: "/swaps" },
    { title: "Staking", path: "/staking" },
    { title: "IBPLs", path: "/ibpls" },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-apple ${
        isScrolled ? 'py-3 bg-background/80 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse-slow">
              <div className="absolute w-6 h-6 bg-background rounded-full"></div>
              <div className="absolute w-4 h-4 bg-primary rounded-full"></div>
            </div>
            <span className="text-xl font-semibold tracking-tight">MyCow Exchange</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="outline" className="button-effect" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
                <Button as={Link} to="/profile" className="button-effect">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/auth/login" 
                  variant="outline" 
                  className="button-effect"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button 
                  as={Link} 
                  to="/auth/register" 
                  className="button-effect"
                >
                  Register
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden rounded-md p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg ${
                    location.pathname === link.path 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-foreground/80 hover:bg-muted'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
              <div className="border-t my-2 border-border"></div>
              {user ? (
                <>
                  <Button 
                    as={Link} 
                    to="/profile" 
                    className="w-full button-effect"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    onClick={() => signOut()} 
                    variant="outline" 
                    className="w-full button-effect"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    as={Link} 
                    to="/auth/login" 
                    variant="outline" 
                    className="w-full button-effect"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button 
                    as={Link} 
                    to="/auth/register" 
                    className="w-full button-effect"
                  >
                    Register
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
