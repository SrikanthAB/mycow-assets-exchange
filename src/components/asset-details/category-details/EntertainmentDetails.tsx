
import React from "react";
import { Tag, Building, Wallet } from "lucide-react";
import DetailSection from "./DetailSection";
import { EntertainmentDetailsType } from "../AssetDetailsContent";

interface EntertainmentDetailsProps {
  details: EntertainmentDetailsType;
}

const EntertainmentDetails = ({ details }: EntertainmentDetailsProps) => {
  return (
    <div className="space-y-4">
      <DetailSection 
        icon={<Tag className="h-5 w-5 text-primary mt-0.5" />}
        title="Content Details"
        details={[
          { label: "Genre", value: details.genre }
        ]}
      />
      
      <DetailSection 
        icon={<Building className="h-5 w-5 text-primary mt-0.5" />}
        title="Distribution"
        details={[
          { label: "Platforms", value: details.platforms },
          { label: "Geographic Reach", value: details.distribution }
        ]}
      />
      
      <DetailSection 
        icon={<Wallet className="h-5 w-5 text-primary mt-0.5" />}
        title="Revenue Structure"
        details={[
          { label: "Revenue Streams", value: details.revenueStreams },
          { label: "Rights Term", value: details.term }
        ]}
      />
    </div>
  );
};

export default EntertainmentDetails;
