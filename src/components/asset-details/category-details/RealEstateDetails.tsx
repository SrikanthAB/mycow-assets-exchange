
import React from "react";
import { MapPin, Building, Clock } from "lucide-react";
import DetailSection from "./DetailSection";
import { RealEstateDetailsType } from "../AssetDetailsContent";

interface RealEstateDetailsProps {
  details: RealEstateDetailsType;
}

const RealEstateDetails = ({ details }: RealEstateDetailsProps) => {
  return (
    <div className="space-y-4">
      <DetailSection 
        icon={<MapPin className="h-5 w-5 text-primary mt-0.5" />}
        title="Location"
        details={[
          { label: "", value: details.location }
        ]}
      />
      
      <DetailSection 
        icon={<Building className="h-5 w-5 text-primary mt-0.5" />}
        title="Property Details"
        details={[
          { label: "Total Area", value: details.squareFootage },
          { label: "Current Occupancy", value: details.occupancy },
          { label: "Developed", value: details.yearBuilt }
        ]}
      />
      
      <DetailSection 
        icon={<Clock className="h-5 w-5 text-primary mt-0.5" />}
        title="Lease Information"
        details={[
          { label: "Average Lease Term", value: details.leaseTerm },
          { label: "Key Tenants", value: details.keyTenants }
        ]}
      />
    </div>
  );
};

export default RealEstateDetails;
