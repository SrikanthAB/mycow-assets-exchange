
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NoTokensAvailableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NoTokensAvailable = ({ open, onOpenChange }: NoTokensAvailableProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>No Available Tokens</DialogTitle>
          <DialogDescription>
            You don't have any unstaked tokens available
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default NoTokensAvailable;
