
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Info, MapPin, Building, Clock, Calendar, Tag, Wallet } from "lucide-react";

interface AssetDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    id: string;
    name: string;
    symbol: string;
    category: string;
    price: string;
    change: number;
    yield?: string;
  };
}

const AssetDetailsModal = ({ open, onOpenChange, asset }: AssetDetailsModalProps) => {
  // This function generates mock details based on the asset category and name
  const getAssetDetails = () => {
    switch (asset.category) {
      case "Real Estate":
        return {
          location: asset.name.includes("Embassy") ? "Bengaluru, India" : "Mumbai, India",
          leaseTerm: "5-7 years",
          occupancy: "94%",
          squareFootage: asset.name.includes("Embassy") ? "33.6 million sq ft" : "22.1 million sq ft",
          keyTenants: asset.name.includes("Embassy") ? "IBM, Microsoft, Google" : "HSBC, JP Morgan, TCS",
          yearBuilt: asset.name.includes("Embassy") ? "2012-2019" : "2015-2020",
          documentUrl: "#"
        };
      case "Commodity":
        return {
          purity: asset.name.includes("Gold") ? "99.99% (24K)" : "99.95%",
          storage: "LBMA Approved Vaults",
          custody: "Brinks Security",
          redemption: "Physical or Digital",
          audit: "Quarterly",
          insurance: "100% Insured",
          documentUrl: "#"
        };
      case "Entertainment":
        return {
          genre: asset.name.includes("Movie") ? "Bollywood Blockbusters" : "OTT Series",
          platforms: asset.name.includes("Movie") ? "Theatrical, OTT, Cable" : "Netflix, Amazon Prime, Disney+",
          revenueStreams: "Box Office, Streaming, Merchandise, Music Rights",
          term: "7 years",
          distribution: "International",
          documentUrl: "#"
        };
      case "Private Credit":
        return {
          borrowers: "Mid-sized Enterprises",
          loanType: "Secured Corporate Loans",
          interestRate: "9-13% p.a.",
          collateral: "Corporate Assets, Receivables",
          term: "12-36 months",
          diversification: "Across 15+ sectors",
          documentUrl: "#"
        };
      case "Stablecoin":
        return {
          pegged: asset.name.includes("Gold") ? "Gold Price" : "Indian Rupee",
          backing: asset.name.includes("Gold") ? "100% Physical Gold Reserves" : "100% Cash Reserves",
          custodian: "IDBI Bank",
          redemption: "T+1 Settlement",
          audit: "Monthly",
          regulation: "RBI Compliant",
          documentUrl: "#"
        };
      case "Native Token":
        return {
          utility: "Platform Governance, Fee Discounts, Staking Rewards",
          circulation: "100 Million",
          maxSupply: "250 Million",
          tokenomics: "Deflationary Model with Quarterly Burns",
          governance: "DAO Voting Rights",
          documentUrl: "#"
        };
      default:
        return {
          description: "Detailed information not available for this asset type.",
          documentUrl: "#"
        };
    }
  };

  const details = getAssetDetails();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {asset.name} ({asset.symbol}) Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about this tokenized {asset.category.toLowerCase()} asset
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              {asset.category === "Real Estate" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground">{details.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Property Details</h3>
                      <p className="text-sm text-muted-foreground">Total Area: {details.squareFootage}</p>
                      <p className="text-sm text-muted-foreground">Current Occupancy: {details.occupancy}</p>
                      <p className="text-sm text-muted-foreground">Developed: {details.yearBuilt}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Lease Information</h3>
                      <p className="text-sm text-muted-foreground">Average Lease Term: {details.leaseTerm}</p>
                      <p className="text-sm text-muted-foreground">Key Tenants: {details.keyTenants}</p>
                    </div>
                  </div>
                </div>
              )}

              {asset.category === "Commodity" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Commodity Specifications</h3>
                      <p className="text-sm text-muted-foreground">Purity: {details.purity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Storage & Security</h3>
                      <p className="text-sm text-muted-foreground">Storage Facility: {details.storage}</p>
                      <p className="text-sm text-muted-foreground">Custodian: {details.custody}</p>
                      <p className="text-sm text-muted-foreground">Insurance: {details.insurance}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Wallet className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Redemption Options</h3>
                      <p className="text-sm text-muted-foreground">Redemption Type: {details.redemption}</p>
                      <p className="text-sm text-muted-foreground">Audit Frequency: {details.audit}</p>
                    </div>
                  </div>
                </div>
              )}

              {asset.category === "Entertainment" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Content Details</h3>
                      <p className="text-sm text-muted-foreground">Genre: {details.genre}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Distribution</h3>
                      <p className="text-sm text-muted-foreground">Platforms: {details.platforms}</p>
                      <p className="text-sm text-muted-foreground">Geographic Reach: {details.distribution}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Wallet className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Revenue Structure</h3>
                      <p className="text-sm text-muted-foreground">Revenue Streams: {details.revenueStreams}</p>
                      <p className="text-sm text-muted-foreground">Rights Term: {details.term}</p>
                    </div>
                  </div>
                </div>
              )}

              {asset.category === "Private Credit" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Loan Details</h3>
                      <p className="text-sm text-muted-foreground">Borrower Profile: {details.borrowers}</p>
                      <p className="text-sm text-muted-foreground">Loan Type: {details.loanType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Wallet className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Financial Terms</h3>
                      <p className="text-sm text-muted-foreground">Interest Rate: {details.interestRate}</p>
                      <p className="text-sm text-muted-foreground">Collateral: {details.collateral}</p>
                      <p className="text-sm text-muted-foreground">Loan Term: {details.term}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Risk Management</h3>
                      <p className="text-sm text-muted-foreground">Diversification: {details.diversification}</p>
                    </div>
                  </div>
                </div>
              )}

              {asset.category === "Stablecoin" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Stability Mechanism</h3>
                      <p className="text-sm text-muted-foreground">Pegged To: {details.pegged}</p>
                      <p className="text-sm text-muted-foreground">Backing: {details.backing}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Security & Compliance</h3>
                      <p className="text-sm text-muted-foreground">Custodian: {details.custodian}</p>
                      <p className="text-sm text-muted-foreground">Audit Frequency: {details.audit}</p>
                      <p className="text-sm text-muted-foreground">Regulatory Status: {details.regulation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Wallet className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Redemption Process</h3>
                      <p className="text-sm text-muted-foreground">Settlement Time: {details.redemption}</p>
                    </div>
                  </div>
                </div>
              )}

              {asset.category === "Native Token" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Token Utility</h3>
                      <p className="text-sm text-muted-foreground">{details.utility}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Token Economics</h3>
                      <p className="text-sm text-muted-foreground">Circulating Supply: {details.circulation}</p>
                      <p className="text-sm text-muted-foreground">Maximum Supply: {details.maxSupply}</p>
                      <p className="text-sm text-muted-foreground">Economic Model: {details.tokenomics}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Wallet className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Governance</h3>
                      <p className="text-sm text-muted-foreground">{details.governance}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download Documentation</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Note: This information is provided for educational purposes only and should not be considered investment advice.
            Always conduct your own research before making investment decisions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsModal;
