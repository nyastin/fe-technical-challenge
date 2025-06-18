import { GrandmastersResponse, Player, PlayerProfile } from "./types";

const BASE_URL = "https://api.chess.com/pub";

export class ChessApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ChessApiError";
  }
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Chess Grandmasters Wiki (Technical Challenge)",
        },
      });

      if (response.ok) {
        return response;
      }

      // If rate limited, wait and retry
      if (response.status === 429 && i < retries - 1) {
        const retryAfter = response.headers.get("Retry-After");
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000 * (i + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw new ChessApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
      );
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw new ChessApiError("Max retries exceeded");
}

export async function fetchGrandmasters(): Promise<string[]> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/titled/GM`);
    const data: GrandmastersResponse = await response.json();
    return data.players;
  } catch (error) {
    if (error instanceof ChessApiError) {
      throw error;
    }
    throw new ChessApiError(`Failed to fetch grandmasters: ${error}`);
  }
}

export async function fetchPlayer(username: string): Promise<PlayerProfile> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/player/${username}`);
    const data: Player = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ChessApiError) {
      throw error;
    }
    throw new ChessApiError(`Failed to fetch player ${username}: ${error}`);
  }
}

export async function fetchPlayerStats(username: string) {
  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/player/${username}/stats`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ChessApiError) {
      throw error;
    }
    throw new ChessApiError(`Failed to fetch stats for ${username}: ${error}`);
  }
}

