"use client";

import { useState, useEffect } from "react";

interface LastOnlineClockProps {
  lastOnlineTimestamp: number;
  className?: string;
}

export function LastOnlineClock({ 
  lastOnlineTimestamp, 
  className = "" 
}: LastOnlineClockProps) {
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");

  useEffect(() => {
    function calculateTimeElapsed() {
      try {
        if (!lastOnlineTimestamp || typeof lastOnlineTimestamp !== "number" || lastOnlineTimestamp <= 0) {
          return "00:00:00";
        }

        const now = Date.now();
        const lastOnlineMs = lastOnlineTimestamp * 1000; // Convert to milliseconds
        const diffMs = now - lastOnlineMs;

        // If the difference is negative, show 00:00:00
        if (diffMs < 0) {
          return "00:00:00";
        }

        // Calculate hours, minutes, and seconds
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Cap at 999:59:59 to prevent overflow
        const cappedHours = Math.min(999, hours);

        // Format as HH:MM:SS
        const formatTime = (num: number) => num.toString().padStart(2, "0");
        const formatHours = (num: number) => num.toString().padStart(2, "0");
        
        return `${formatHours(cappedHours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
      } catch (error) {
        console.error("Error calculating time elapsed:", error);
        return "00:00:00";
      }
    }

    // Initial calculation
    const initialTime = calculateTimeElapsed();
    setTimeElapsed(initialTime);

    // Only set up interval if we have a valid timestamp
    if (!lastOnlineTimestamp || typeof lastOnlineTimestamp !== "number" || lastOnlineTimestamp <= 0) {
      return;
    }

    // Set up interval to update every second
    const interval = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [lastOnlineTimestamp]);

  return (
    <span className={`font-mono text-sm ${className}`} title="Time since last online">
      {timeElapsed}
    </span>
  );
} 