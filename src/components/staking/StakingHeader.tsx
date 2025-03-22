
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const StakingHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
      <div>
        <h2>Yield Management</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Optimize returns on your tokenized RWAs by reinvesting yields into strategic allocations.
        </p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <Button variant="outline" className="flex items-center gap-2">
          <Info size={16} />
          Learn About Yields
        </Button>
      </div>
    </div>
  );
};

export default StakingHeader;
