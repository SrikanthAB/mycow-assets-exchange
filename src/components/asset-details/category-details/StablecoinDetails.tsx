
import React from "react";
import { Tag, Building, Wallet } from "lucide-react";
import DetailSection from "./DetailSection";

interface StablecoinDetailsProps {
  details: {
    pegged: string;
    backing: string;
    custodian: string;
    location: string;
    audit: string;
    regulation: string;
    redemption: string;
  };
}

const StablecoinDetails = ({ details }: StablecoinDetailsProps) => {
  return (
    <div className="space-y-4">
      <DetailSection 
        icon={<Tag className="h-5 w-5 text-primary mt-0.5" />}
        title="Stability Mechanism"
        details={[
          { label: "Pegged To", value: details.pegged },
          { label: "Backing", value: details.backing }
        ]}
      />
      
      <DetailSection 
        icon={<Building className="h-5 w-5 text-primary mt-0.5" />}
        title="Security & Compliance"
        details={[
          { label: "Custodian", value: details.custodian },
          { label: "Storage Location", value: details.location },
          { label: "Audit Frequency", value: details.audit },
          { label: "Regulatory Status", value: details.regulation }
        ]}
      />
      
      <DetailSection 
        icon={<Wallet className="h-5 w-5 text-primary mt-0.5" />}
        title="Redemption Process"
        details={[
          { label: "Settlement Time", value: details.redemption }
        ]}
      />
    </div>
  );
};

export default StablecoinDetails;
