import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRightIcon } from "lucide-react";

interface GrandmasterCardProps {
  username: string;
  onClick: () => void;
}

export function GrandmasterCard({ username, onClick }: GrandmasterCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 border-transparent hover:border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">{username}</h3>
            <Badge variant="secondary" className="text-xs">
              Grandmaster
            </Badge>
          </div>
          <div className="flex items-center text-muted-foreground">
            <ChevronRightIcon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

