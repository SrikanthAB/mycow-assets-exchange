
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Handle link click with appropriate behavior based on link type
  const handleLinkClick = (link: any, e: React.MouseEvent) => {
    if (link.isComingSoon) {
      e.preventDefault();
      // Show toast notification for coming soon pages
      toast({
        title: "Coming Soon",
        description: `The ${link.name} page is under development and will be available soon.`,
        variant: "default",
      });
    } else if (link.isExternal && link.url) {
      // External links open in a new tab, no need to prevent default
    } else {
      // For internal links, navigate programmatically and scroll to top
      e.preventDefault();
      navigate(link.path);
      window.scrollTo(0, 0);
    }
  };
  
  // Organize footer links with the updated product section
  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "MyCow Layer 1", path: "/layer1", isComingSoon: true },
        { name: "MyCow RWA's", path: "/rwas", isComingSoon: true },
        { name: "MyCow Exchange", path: "/exchange", isComingSoon: true },
        { name: "MyCow Stable Coin", path: "/stablecoin", isComingSoon: true },
        { name: "Markets", path: "/markets" }, // Existing route
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "/docs", isExternal: true, url: "https://docs.mycow.exchange" },
        { name: "API", path: "/api", isExternal: true, url: "https://api.mycow.exchange" },
        { name: "Market Data", path: "/markets" }, // Redirecting to existing markets page
        { name: "Market Status", path: "/status", isExternal: true, url: "https://status.mycow.exchange" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "/about", isComingSoon: true },
        { name: "Press", path: "/press", isComingSoon: true },
        { name: "Careers", path: "/careers", isComingSoon: true },
        { name: "Security", path: "/security", isComingSoon: true },
        { name: "Blog", path: "/blog", isComingSoon: true },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", path: "/terms", isComingSoon: true },
        { name: "Privacy", path: "/privacy", isComingSoon: true },
        { name: "Cookies", path: "/cookies", isComingSoon: true },
        { name: "License", path: "/license", isComingSoon: true },
      ]
    }
  ];
  
  return (
    <footer className="bg-muted">
      <div className="container mx-auto py-12 px-4 md:px-6 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/2357ba2d-c9c0-46f4-8848-6384dd15da4b.png" 
                alt="MyCow Logo" 
                className="h-8 w-auto" 
              />
              <span className="text-xl font-semibold tracking-tight">MyCow Exchange</span>
            </Link>
            
            <p className="mt-4 text-muted-foreground max-w-md">
              India's premier centralized exchange for Tokenized Real-World Assets (RWAs), offering seamless investment opportunities across various asset classes.
            </p>
            
            <div className="mt-6 flex items-center space-x-4">
              {[
                { name: "Twitter", url: "https://twitter.com/mycowexchange" },
                { name: "LinkedIn", url: "https://linkedin.com/company/mycowexchange" },
                { name: "Facebook", url: "https://facebook.com/mycowexchange" },
                { name: "Telegram", url: "https://t.me/mycowexchange" }
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background hover:bg-background/80 transition-colors"
                  aria-label={social.name}
                >
                  {social.name[0]}
                </a>
              ))}
            </div>
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-medium text-base mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.isExternal && link.url ? (
                      <a 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                        onClick={(e) => handleLinkClick(link, e)}
                      >
                        {link.name}
                        {section.title === "Products" && link.isComingSoon && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </a>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                        onClick={(e) => handleLinkClick(link, e)}
                      >
                        {link.name}
                        {section.title === "Products" && link.isComingSoon && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-sm text-muted-foreground">&copy; {currentYear} MyCow Exchange. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap items-center">
              <p className="text-sm text-muted-foreground mr-4">Regulated by Financial Authorities of India</p>
              <div className="flex items-center space-x-3 mt-2 md:mt-0">
                <img src="https://placehold.co/40x20?text=RBI" alt="RBI Compliance" className="h-5 w-auto opacity-60" />
                <img src="https://placehold.co/40x20?text=SEBI" alt="SEBI Compliance" className="h-5 w-auto opacity-60" />
                <img src="https://placehold.co/40x20?text=IFSC" alt="IFSC Compliance" className="h-5 w-auto opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
