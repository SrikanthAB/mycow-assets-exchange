
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarketSection from "@/components/MarketSection";
import Footer from "@/components/Footer";
import { ArrowRight, BarChart2, Shield, RefreshCw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  const features = [
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "High Liquidity Markets",
      description: "Trade tokenized assets with deep liquidity pools and minimal slippage across all asset classes."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Regulated & Secure",
      description: "Regulated platform with institutional-grade security measures to protect your investments."
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Seamless Swaps",
      description: "Effortlessly swap between assets, optimize yields, and create conditional time-bound exchanges."
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Investment-Backed Loans",
      description: "Access liquidity through over-collateralized loans without triggering capital gains taxes."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
              <h2 className="text-balance">Reimagining Asset Trading for the Digital Age</h2>
              <p className="mt-4 text-muted-foreground text-lg text-balance">
                Our comprehensive platform combines the benefits of blockchain technology with traditional financial instruments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-background rounded-xl p-6 shadow-sm hover-elevate animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button size="lg" variant="outline" className="button-effect">
                Learn More About Our Platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        <MarketSection />
        
        {/* CTA Section - Only shown to non-authenticated users */}
        {!user && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto bg-gradient-soft from-primary/10 to-mycow-500/10 rounded-2xl p-8 md:p-12 relative overflow-hidden animate-fade-in">
                {/* Background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-mycow-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 text-center">
                  <h2 className="text-balance">Ready to Start Your Investment Journey?</h2>
                  <p className="mt-4 text-lg text-foreground/80 text-balance max-w-2xl mx-auto">
                    Join thousands of investors who are already diversifying their portfolios with tokenized real-world assets on MyCow Exchange.
                  </p>
                  
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button size="lg" className="button-effect shadow-button">
                      Create Free Account
                    </Button>
                    <Button size="lg" variant="outline" className="button-effect">
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
