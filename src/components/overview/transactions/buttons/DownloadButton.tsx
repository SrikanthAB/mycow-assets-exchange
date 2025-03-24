
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      <Download size={16} />
      Download
    </Button>
  );
};

export default DownloadButton;
