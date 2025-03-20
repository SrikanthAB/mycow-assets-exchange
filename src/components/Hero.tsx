
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-mycow-300/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
            India's Premier Exchange for Tokenized Real-World Assets
          </div>
          
          <h1 className="text-balance animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="block">Trading Reimagined for</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-mycow-500">Real-World Assets</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-foreground/80 text-balance max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            MyCow Exchange brings tokenized commercial real estate, digital gold, private credit, and more onto one unified platform with unmatched liquidity and accessibility.
          </p>
          
          {/* Conditional buttons based on authentication status */}
          {!user ? (
            <div className="mt-10 flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="button-effect shadow-button" asChild>
                <Link to="/login">
                  Start Trading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="button-effect" asChild>
                <Link to="/markets">
                  Explore Assets
                </Link>
              </Button>
            </div>
          ) : null}
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { number: "₹10 Cr+", label: "Daily Trading Volume" },
              { number: "6+", label: "Asset Classes" },
              { number: "10,000+", label: "Verified Users" },
              { number: "99.9%", label: "Platform Uptime" }
            ].map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-semibold text-foreground">{stat.number}</span>
                <span className="text-sm text-foreground/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
