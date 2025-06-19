import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LastOnlineClock } from "./last-online-clock";
import { ClockIcon } from "lucide-react";

interface OfflineDurationCardProps {
  lastOnlineTimestamp: number;
  playerName: string;
}

export function OfflineDurationCard({ 
  lastOnlineTimestamp, 
  playerName 
}: OfflineDurationCardProps) {
  return (
    <Card className="border-dashed border-2 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          Time Since Last Online
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center">
          <LastOnlineClock 
            lastOnlineTimestamp={lastOnlineTimestamp}
            className="text-2xl font-bold font-mono text-orange-800 dark:text-orange-200"
          />
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            {playerName} has been offline for this duration
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 