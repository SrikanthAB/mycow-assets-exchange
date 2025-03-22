
import React from "react";
import { Tag, Building, Wallet } from "lucide-react";
import DetailSection from "./DetailSection";
import { NativeTokenDetailsType } from "../AssetDetailsContent";

interface NativeTokenDetailsProps {
  details: NativeTokenDetailsType;
}

const NativeTokenDetails = ({ details }: NativeTokenDetailsProps) => {
  return (
    <div className="space-y-4">
      <DetailSection 
        icon={<Tag className="h-5 w-5 text-primary mt-0.5" />}
        title="Token Utility"
        details={[
          { label: "", value: details.utility }
        ]}
      />
      
      <DetailSection 
        icon={<Building className="h-5 w-5 text-primary mt-0.5" />}
        title="Token Economics"
        details={[
          { label: "Circulating Supply", value: details.circulation },
          { label: "Maximum Supply", value: details.maxSupply },
          { label: "Economic Model", value: details.tokenomics }
        ]}
      />
      
      <DetailSection 
        icon={<Wallet className="h-5 w-5 text-primary mt-0.5" />}
        title="Governance"
        details={[
          { label: "", value: details.governance }
        ]}
      />
    </div>
  );
};

export default NativeTokenDetails;
