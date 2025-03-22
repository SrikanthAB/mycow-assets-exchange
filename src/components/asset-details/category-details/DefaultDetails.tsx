
import React from "react";
import { FileText } from "lucide-react";
import DetailSection from "./DetailSection";

interface DefaultDetailsProps {
  details: {
    description: string;
  };
}

const DefaultDetails = ({ details }: DefaultDetailsProps) => {
  return (
    <div className="space-y-4">
      <DetailSection 
        icon={<FileText className="h-5 w-5 text-primary mt-0.5" />}
        title="Asset Information"
        details={[
          { label: "", value: details.description }
        ]}
      />
    </div>
  );
};

export default DefaultDetails;
