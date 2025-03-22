
import React from "react";
import { Tag, Wallet, Building } from "lucide-react";
import DetailSection from "./DetailSection";
import { PrivateCreditDetailsType } from "../AssetDetailsContent";

interface PrivateCreditDetailsProps {
  details: PrivateCreditDetailsType;
}

const PrivateCreditDetails = ({ details }: PrivateCreditDetailsProps) => {
  return (
    <div className="space-y-4">
      <DetailSection 
        icon={<Tag className="h-5 w-5 text-primary mt-0.5" />}
        title="Loan Details"
        details={[
          { label: "Borrower Profile", value: details.borrowers },
          { label: "Loan Type", value: details.loanType }
        ]}
      />
      
      <DetailSection 
        icon={<Wallet className="h-5 w-5 text-primary mt-0.5" />}
        title="Financial Terms"
        details={[
          { label: "Interest Rate", value: details.interestRate },
          { label: "Collateral", value: details.collateral },
          { label: "Loan Term", value: details.term }
        ]}
      />
      
      <DetailSection 
        icon={<Building className="h-5 w-5 text-primary mt-0.5" />}
        title="Risk Management"
        details={[
          { label: "Diversification", value: details.diversification }
        ]}
      />
    </div>
  );
};

export default PrivateCreditDetails;
