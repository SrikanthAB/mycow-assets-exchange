
import React from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupportChatButtonProps {
  onClick: () => void;
}

const SupportChatButton: React.FC<SupportChatButtonProps> = ({ onClick }) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onClick}
      aria-label="AI Support"
      className="text-muted-foreground hover:text-foreground relative"
    >
      <Bot className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
      </span>
      <span className="sr-only">AI Support</span>
    </Button>
  );
};

export default SupportChatButton;
