
import React from "react";
import { Tag, Building, Wallet } from "lucide-react";
import DetailSection from "./DetailSection";

interface CommodityDetailsProps {
  details: {
    purity: string;
    storage: string;
    custody: string;
    insurance: string;
    redemption: string;
    audit: string;
  };
}

const CommodityDetails = ({ details }: CommodityDetailsProps) => {
  return (
    <div className="space-y-4">
      <DetailSection 
        icon={<Tag className="h-5 w-5 text-primary mt-0.5" />}
        title="Commodity Specifications"
        details={[
          { label: "Purity", value: details.purity }
        ]}
      />
      
      <DetailSection 
        icon={<Building className="h-5 w-5 text-primary mt-0.5" />}
        title="Storage & Security"
        details={[
          { label: "Storage Facility", value: details.storage },
          { label: "Custodian", value: details.custody },
          { label: "Insurance", value: details.insurance }
        ]}
      />
      
      <DetailSection 
        icon={<Wallet className="h-5 w-5 text-primary mt-0.5" />}
        title="Redemption Options"
        details={[
          { label: "Redemption Type", value: details.redemption },
          { label: "Audit Frequency", value: details.audit }
        ]}
      />
    </div>
  );
};

export default CommodityDetails;
