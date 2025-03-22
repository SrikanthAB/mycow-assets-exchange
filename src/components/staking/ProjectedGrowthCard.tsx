
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const ProjectedGrowthCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projected Growth with Yield Reinvestment</CardTitle>
        <CardDescription>
          See how your investments can grow over time with compound returns
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Growth Chart Coming Soon</p>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 flex justify-between">
        <div className="text-sm text-muted-foreground">
          Projections based on historical performance
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          See Detailed Analytics
          <ChevronRight size={14} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectedGrowthCard;
