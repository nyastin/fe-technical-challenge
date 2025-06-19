"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPlayer, fetchPlayerStats, ChessApiError } from "@/lib/chess-api";
import { PlayerProfile, PlayerStats } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  ArrowLeftIcon,
  UserIcon,
  TrophyIcon,
  CalendarIcon,
  GlobeIcon,
} from "lucide-react";
import Image from "next/image";

function PlayerProfilePageContent() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadPlayerData() {
      if (!username) return;

      try {
        setIsLoading(true);
        setError(null);
        setImageError(false);

        // Fetch player profile and stats in parallel
        const [playerData, statsData] = await Promise.allSettled([
          fetchPlayer(username),
          fetchPlayerStats(username),
        ]);

        if (playerData.status === "fulfilled") {
          setPlayer(playerData.value);
        } else {
          throw playerData.reason;
        }

        if (statsData.status === "fulfilled") {
          setStats(statsData.value);
        }
        // Stats are optional, so we don't throw if they fail
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

    loadPlayerData();
  }, [username]);

  function handleBack() {
    router.push("/");
  }

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    // Re-trigger the effect by changing a dependency
    window.location.reload();
  }

  function formatDate(timestamp: number) {
    try {
      if (!timestamp || typeof timestamp !== 'number' || timestamp <= 0) {
        return 'Unknown date';
      }
      return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return 'Invalid date';
    }
  }

  function formatLastOnline(timestamp: number) {
    try {
      if (!timestamp || typeof timestamp !== 'number' || timestamp <= 0) {
        return 'Unknown';
      }
      
      const now = Date.now();
      const lastOnline = timestamp * 1000;
      const diffMs = now - lastOnline;
      
      if (diffMs < 0) {
        return 'Recently';
      }
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return `${Math.max(0, diffMinutes)} minutes ago`;
        }
        return `${diffHours} hours ago`;
      }

      return `${diffDays} days ago`;
    } catch {
      return 'Unknown';
    }
  }

  // Helper function to safely get rating with fallback
  function getSafeRating(
    gameStats: PlayerStats['chess_blitz'] | PlayerStats['chess_rapid'] | PlayerStats['chess_bullet'], 
    type: 'last' | 'best', 
    fallback: string | number = 'N/A'
  ) {
    return gameStats?.[type]?.rating ?? fallback;
  }

  // Helper function to safely get game record with fallbacks
  function getSafeRecord(
    gameStats: PlayerStats['chess_blitz'] | PlayerStats['chess_rapid'] | PlayerStats['chess_bullet']
  ) {
    const record = gameStats?.record;
    return {
      win: record?.win ?? 0,
      loss: record?.loss ?? 0,
      draw: record?.draw ?? 0,
    };
  }

  // Helper function to check if game stats are valid and complete
  function isValidGameStats(
    gameStats: PlayerStats['chess_blitz'] | PlayerStats['chess_rapid'] | PlayerStats['chess_bullet']
  ): gameStats is NonNullable<PlayerStats['chess_blitz']> {
    return gameStats !== undefined && 
           gameStats.last !== undefined && 
           typeof gameStats.last.rating === 'number' &&
           gameStats.best !== undefined &&
           typeof gameStats.best.rating === 'number' &&
           gameStats.record !== undefined &&
           typeof gameStats.record.win === 'number';
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Player Profile
          </h1>
          <p className="text-muted-foreground max-w-md">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleBack} variant="outline">
              Back to List
            </Button>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-40 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-4 w-36 mx-auto" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4 space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Player Not Found</h1>
          <p className="text-muted-foreground">
            The player &quot;{username}&quot; could not be found.
          </p>
          <Button onClick={handleBack}>Back to List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={handleBack} variant="outline" className="mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Grandmasters
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {player.name ?? player.username}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default">{player.title ?? "GM"}</Badge>
            {player.verified && <Badge variant="secondary">Verified</Badge>}
            {player.is_streamer && <Badge variant="outline">Streamer</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {player.avatar && !imageError ? (
                    <Image
                      src={player.avatar}
                      width={100}
                      height={100}
                      alt={`${player.username} avatar`}
                      className="w-24 h-24 rounded-full border-2 border-border"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-2 border-border bg-muted flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">{player.username}</h3>
                  {player.name && player.name !== player.username && (
                    <p className="text-muted-foreground">{player.name}</p>
                  )}
                </div>

                <div className="space-y-3 pt-4">
                  {player.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <GlobeIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{player.location}</span>
                    </div>
                  )}

                  {player.joined && (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {formatDate(player.joined)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          player.status === "online"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <span>
                      {player.status === "online"
                        ? "Online now"
                        : player.last_online 
                          ? `Last seen ${formatLastOnline(player.last_online)}`
                          : "Status unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chess Statistics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5" />
                  Chess Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.chess_blitz && isValidGameStats(stats.chess_blitz) && (
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                            BLITZ
                          </h4>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold">
                              {getSafeRating(stats.chess_blitz, 'last')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Best: {getSafeRating(stats.chess_blitz, 'best')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              W: {getSafeRecord(stats.chess_blitz).win} | L:{" "}
                              {getSafeRecord(stats.chess_blitz).loss} | D:{" "}
                              {getSafeRecord(stats.chess_blitz).draw}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {stats.chess_rapid && isValidGameStats(stats.chess_rapid) && (
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                            RAPID
                          </h4>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold">
                              {getSafeRating(stats.chess_rapid, 'last')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Best: {getSafeRating(stats.chess_rapid, 'best')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              W: {getSafeRecord(stats.chess_rapid).win} | L:{" "}
                              {getSafeRecord(stats.chess_rapid).loss} | D:{" "}
                              {getSafeRecord(stats.chess_rapid).draw}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {stats.chess_bullet && isValidGameStats(stats.chess_bullet) && (
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                            BULLET
                          </h4>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold">
                              {getSafeRating(stats.chess_bullet, 'last')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Best: {getSafeRating(stats.chess_bullet, 'best')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              W: {getSafeRecord(stats.chess_bullet).win} | L:{" "}
                              {getSafeRecord(stats.chess_bullet).loss} | D:{" "}
                              {getSafeRecord(stats.chess_bullet).draw}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Show message if no valid game stats are available */}
                    {(!stats.chess_blitz || !isValidGameStats(stats.chess_blitz)) &&
                     (!stats.chess_rapid || !isValidGameStats(stats.chess_rapid)) &&
                     (!stats.chess_bullet || !isValidGameStats(stats.chess_bullet)) && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">
                          Chess game statistics are incomplete or unavailable for this player.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Chess statistics are not available for this player.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerProfilePage() {
  return (
    <ErrorBoundary>
      <PlayerProfilePageContent />
    </ErrorBoundary>
  );
}
