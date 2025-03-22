
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import RealEstateDetails from "./category-details/RealEstateDetails";
import CommodityDetails from "./category-details/CommodityDetails";
import EntertainmentDetails from "./category-details/EntertainmentDetails";
import PrivateCreditDetails from "./category-details/PrivateCreditDetails";
import StablecoinDetails from "./category-details/StablecoinDetails";
import NativeTokenDetails from "./category-details/NativeTokenDetails";
import DefaultDetails from "./category-details/DefaultDetails";

// Define the category-specific interfaces
export interface RealEstateDetailsType {
  location: string;
  squareFootage: string;
  occupancy: string;
  yearBuilt: string;
  leaseTerm: string;
  keyTenants: string;
  documentUrl?: string;
}

export interface CommodityDetailsType {
  purity: string;
  storage: string;
  custody: string;
  insurance: string;
  redemption: string;
  audit: string;
  documentUrl?: string;
}

export interface EntertainmentDetailsType {
  genre: string;
  platforms: string;
  distribution: string;
  revenueStreams: string;
  term: string;
  documentUrl?: string;
}

export interface PrivateCreditDetailsType {
  borrowers: string;
  loanType: string;
  interestRate: string;
  collateral: string;
  term: string;
  diversification: string;
  documentUrl?: string;
}

export interface StablecoinDetailsType {
  pegged: string;
  backing: string;
  custodian: string;
  location: string;
  audit: string;
  regulation: string;
  redemption: string;
  documentUrl?: string;
}

export interface NativeTokenDetailsType {
  utility: string;
  circulation: string;
  maxSupply: string;
  tokenomics: string;
  governance: string;
  documentUrl?: string;
}

export interface DefaultDetailsType {
  description: string;
  documentUrl?: string;
}

export type AssetDetailsType = 
  | RealEstateDetailsType
  | CommodityDetailsType
  | EntertainmentDetailsType
  | PrivateCreditDetailsType
  | StablecoinDetailsType
  | NativeTokenDetailsType
  | DefaultDetailsType;

interface AssetDetailsContentProps {
  category: string;
  details: AssetDetailsType;
}

const AssetDetailsContent = ({ category, details }: AssetDetailsContentProps) => {
  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        {category === "Real Estate" && (
          <RealEstateDetails details={details as RealEstateDetailsType} />
        )}
        {category === "Commodity" && (
          <CommodityDetails details={details as CommodityDetailsType} />
        )}
        {category === "Entertainment" && (
          <EntertainmentDetails details={details as EntertainmentDetailsType} />
        )}
        {category === "Private Credit" && (
          <PrivateCreditDetails details={details as PrivateCreditDetailsType} />
        )}
        {category === "Stablecoin" && (
          <StablecoinDetails details={details as StablecoinDetailsType} />
        )}
        {category === "Native Token" && (
          <NativeTokenDetails details={details as NativeTokenDetailsType} />
        )}
        {!["Real Estate", "Commodity", "Entertainment", "Private Credit", "Stablecoin", "Native Token"].includes(category) && (
          <DefaultDetails details={details as DefaultDetailsType} />
        )}
      </CardContent>
    </Card>
  );
};

export default AssetDetailsContent;
