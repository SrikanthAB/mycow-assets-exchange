
import {
  RealEstateDetailsType,
  CommodityDetailsType,
  EntertainmentDetailsType,
  PrivateCreditDetailsType,
  StablecoinDetailsType,
  NativeTokenDetailsType,
  DefaultDetailsType,
  AssetDetailsType
} from "./AssetDetailsContent";

// This function generates mock details based on the asset category and name
export const getAssetDetails = (asset: { category: string; name: string }): AssetDetailsType => {
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
      } as RealEstateDetailsType;
    case "Commodity":
      return {
        purity: asset.name.includes("Gold") ? "99.99% (24K)" : "99.95%",
        storage: "LBMA Approved Vaults",
        custody: "Brinks Security",
        redemption: "Physical or Digital",
        audit: "Quarterly",
        insurance: "100% Insured",
        documentUrl: "#"
      } as CommodityDetailsType;
    case "Entertainment":
      return {
        genre: asset.name.includes("Movie") ? "Bollywood Blockbusters" : "OTT Series",
        platforms: asset.name.includes("Movie") ? "Theatrical, OTT, Cable" : "Netflix, Amazon Prime, Disney+",
        revenueStreams: "Box Office, Streaming, Merchandise, Music Rights",
        term: "7 years",
        distribution: "International",
        documentUrl: "#"
      } as EntertainmentDetailsType;
    case "Private Credit":
      return {
        borrowers: "Mid-sized Enterprises",
        loanType: "Secured Corporate Loans",
        interestRate: "9-13% p.a.",
        collateral: "Corporate Assets, Receivables",
        term: "12-36 months",
        diversification: "Across 15+ sectors",
        documentUrl: "#"
      } as PrivateCreditDetailsType;
    case "Stablecoin":
      return {
        pegged: asset.name.includes("Gold") ? "Gold Price" : "Indian Rupee",
        backing: asset.name.includes("Gold") ? "100% Physical Gold Reserves" : "100% Cash Reserves",
        custodian: "IDBI Bank",
        location: "Stored in LBMA Vaults outside India (Singapore/Switzerland)",
        redemption: "T+1 Settlement",
        audit: "Monthly",
        regulation: "RBI Compliant",
        documentUrl: "#"
      } as StablecoinDetailsType;
    case "Native Token":
      return {
        utility: "Platform Governance, Fee Discounts, Staking Rewards",
        circulation: "100 Million",
        maxSupply: "250 Million",
        tokenomics: "Deflationary Model with Quarterly Burns",
        governance: "DAO Voting Rights",
        documentUrl: "#"
      } as NativeTokenDetailsType;
    default:
      return {
        description: "Detailed information not available for this asset type.",
        documentUrl: "#"
      } as DefaultDetailsType;
  }
};
