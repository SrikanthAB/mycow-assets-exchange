
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "Assets", path: "/assets" },
        { name: "Markets", path: "/markets" },
        { name: "Swaps", path: "/swaps" },
        { name: "Staking", path: "/staking" },
        { name: "IBPLs", path: "/ibpls" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "/docs" },
        { name: "API", path: "/api" },
        { name: "Market Data", path: "/market-data" },
        { name: "Market Status", path: "/status" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "/about" },
        { name: "Press", path: "/press" },
        { name: "Careers", path: "/careers" },
        { name: "Security", path: "/security" },
        { name: "Blog", path: "/blog" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", path: "/terms" },
        { name: "Privacy", path: "/privacy" },
        { name: "Cookies", path: "/cookies" },
        { name: "License", path: "/license" },
      ]
    }
  ];
  
  return (
    <footer className="bg-muted">
      <div className="container mx-auto py-12 px-4 md:px-6 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <div className="absolute w-6 h-6 bg-muted rounded-full"></div>
                <div className="absolute w-4 h-4 bg-primary rounded-full"></div>
              </div>
              <span className="text-xl font-semibold tracking-tight">MyCow Exchange</span>
            </Link>
            
            <p className="mt-4 text-muted-foreground max-w-md">
              India's premier centralized exchange for Tokenized Real-World Assets (RWAs), offering seamless investment opportunities across various asset classes.
            </p>
            
            <div className="mt-6 flex items-center space-x-4">
              {["Twitter", "LinkedIn", "Facebook", "Telegram"].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="p-2 rounded-full bg-background hover:bg-background/80 transition-colors"
                  aria-label={social}
                >
                  {social[0]}
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
                    <Link 
                      to={link.path} 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
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
                <span className="h-5 w-auto opacity-60">Logo 1</span>
                <span className="h-5 w-auto opacity-60">Logo 2</span>
                <span className="h-5 w-auto opacity-60">Logo 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
