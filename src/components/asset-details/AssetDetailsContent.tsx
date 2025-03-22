
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import RealEstateDetails from "./category-details/RealEstateDetails";
import CommodityDetails from "./category-details/CommodityDetails";
import EntertainmentDetails from "./category-details/EntertainmentDetails";
import PrivateCreditDetails from "./category-details/PrivateCreditDetails";
import StablecoinDetails from "./category-details/StablecoinDetails";
import NativeTokenDetails from "./category-details/NativeTokenDetails";
import DefaultDetails from "./category-details/DefaultDetails";

interface AssetDetailsContentProps {
  category: string;
  details: Record<string, any>;
}

const AssetDetailsContent = ({ category, details }: AssetDetailsContentProps) => {
  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        {category === "Real Estate" && <RealEstateDetails details={details} />}
        {category === "Commodity" && <CommodityDetails details={details} />}
        {category === "Entertainment" && <EntertainmentDetails details={details} />}
        {category === "Private Credit" && <PrivateCreditDetails details={details} />}
        {category === "Stablecoin" && <StablecoinDetails details={details} />}
        {category === "Native Token" && <NativeTokenDetails details={details} />}
        {!["Real Estate", "Commodity", "Entertainment", "Private Credit", "Stablecoin", "Native Token"].includes(category) && (
          <DefaultDetails details={details} />
        )}
      </CardContent>
    </Card>
  );
};

export default AssetDetailsContent;
