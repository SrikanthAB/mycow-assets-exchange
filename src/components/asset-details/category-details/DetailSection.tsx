
import React, { ReactNode } from "react";

interface DetailItemProps {
  label: string;
  value: string;
}

interface DetailSectionProps {
  icon: ReactNode;
  title: string;
  details: DetailItemProps[];
}

const DetailSection = ({ icon, title, details }: DetailSectionProps) => {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <h3 className="font-medium">{title}</h3>
        {details.map((detail, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {detail.label && `${detail.label}: `}{detail.value}
          </p>
        ))}
      </div>
    </div>
  );
};

export default DetailSection;
