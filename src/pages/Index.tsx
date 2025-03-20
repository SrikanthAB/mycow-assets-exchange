
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarketSection from "@/components/MarketSection";
import Footer from "@/components/Footer";
import { ArrowRight, BarChart2, Shield, RefreshCw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [showPlatformDetails, setShowPlatformDetails] = useState(false);
  
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

  const platformProducts = [
    {
      title: "Tokenized Real Estate",
      description: "Invest in premium commercial real estate properties with fractional ownership starting from just ₹1,000. Earn rental yields and capital appreciation without the hassles of property management.",
      benefits: ["Low entry threshold", "Regular rental income", "Professional management", "Liquidity via secondary market"]
    },
    {
      title: "Digital Gold",
      description: "Buy, sell, and store 99.9% pure gold backed by physical reserves. Track real-time prices and convert to physical gold when needed, with no storage or insurance costs.",
      benefits: ["100% physical backing", "Zero storage fees", "Real-time price updates", "Physical redemption option"]
    },
    {
      title: "Yield Strategies",
      description: "Access curated yield-generating strategies across multiple asset classes. Our automated protocols optimize for maximum returns while balancing risk parameters to match your risk profile.",
      benefits: ["Automated rebalancing", "Risk-adjusted returns", "Diversified exposure", "Daily yield accrual"]
    },
    {
      title: "Investment-Backed Loans",
      description: "Unlock liquidity from your existing investments without selling them. Get instant loans against your portfolio assets at competitive interest rates with flexible repayment terms.",
      benefits: ["No credit checks", "Instant approval", "Competitive rates", "Flexible collateral options"]
    },
    {
      title: "Cross-Asset Swaps",
      description: "Seamlessly swap between different asset classes in real-time. Move from real estate tokens to digital gold or fiat with minimal slippage and transaction fees.",
      benefits: ["Cross-asset liquidity", "Instant settlement", "Low transaction fees", "Conditional swap options"]
    },
    {
      title: "Institutional Services",
      description: "Comprehensive solutions for HNIs, family offices, and institutions with personalized service, advanced API access, OTC desk, and white-glove onboarding.",
      benefits: ["Dedicated relationship manager", "OTC desk for large trades", "Customized reporting", "Advanced API integration"]
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
              <Button 
                size="lg" 
                variant="outline" 
                className="button-effect"
                onClick={() => setShowPlatformDetails(!showPlatformDetails)}
              >
                {showPlatformDetails ? "Hide Platform Details" : "Learn More About Our Platform"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Platform Details Section - Only shown when Learn More is clicked */}
        {showPlatformDetails && (
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="mb-6">MyCow Exchange Products</h2>
                <p className="text-muted-foreground text-lg text-balance">
                  Explore our comprehensive suite of financial products designed to revolutionize your investment experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {platformProducts.map((product, index) => (
                  <div key={index} className="bg-card rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-xl font-medium mb-3">{product.title}</h3>
                    <p className="text-muted-foreground mb-6">{product.description}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Benefits:</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {product.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
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
