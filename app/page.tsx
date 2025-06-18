"use client";

import { useState, useEffect } from "react";
import { fetchGrandmasters, ChessApiError } from "@/lib/chess-api";
import { GrandmasterCard } from "@/components/grandmaster-card";
import { GrandmasterSkeleton } from "@/components/grandmaster-skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [grandmasters, setGrandmasters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    async function loadGrandmasters() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchGrandmasters();
        setGrandmasters(data);
      } catch (err) {
        if (err instanceof ChessApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadGrandmasters();
  }, []);

  function handleGrandmasterClick(username: string) {
    // TODO: Navigate to player profile page (Step 2)
    console.log("Navigate to:", username);
    alert(
      `Navigation to ${username} profile page will be implemented in Step 2`,
    );
  }

  function handleLoadMore() {
    setDisplayCount((prev) => prev + 20);
  }

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    // Re-trigger the effect
    window.location.reload();
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Grandmasters
          </h1>
          <p className="text-muted-foreground max-w-md">{error}</p>
          <Button onClick={handleRetry}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Chess Grandmasters Wiki
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore the world&apos;s chess grandmasters and their achievements
          </p>
          {!isLoading && grandmasters.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {Math.min(displayCount, grandmasters.length)} of{" "}
              {grandmasters.length} grandmasters
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <GrandmasterSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {grandmasters.slice(0, displayCount).map((username) => (
                <GrandmasterCard
                  key={username}
                  username={username}
                  onClick={() => handleGrandmasterClick(username)}
                />
              ))}
            </div>

            {displayCount < grandmasters.length && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore} variant="outline">
                  Load More ({grandmasters.length - displayCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
