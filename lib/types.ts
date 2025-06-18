// Chess.com API Types

export type GrandmastersResponse = {
  players: string[];
};

export type PlayerStats = {
  chess_blitz?: {
    last: {
      rating: number;
      date: number;
    };
    best: {
      rating: number;
      date: number;
    };
    record: {
      win: number;
      loss: number;
      draw: number;
    };
  };
  chess_rapid?: {
    last: {
      rating: number;
      date: number;
    };
    best: {
      rating: number;
      date: number;
    };
    record: {
      win: number;
      loss: number;
      draw: number;
    };
  };
  chess_bullet?: {
    last: {
      rating: number;
      date: number;
    };
    best: {
      rating: number;
      date: number;
    };
    record: {
      win: number;
      loss: number;
      draw: number;
    };
  };
};

export type Player = {
  player_id: number;
  "@id": string;
  url: string;
  username: string;
  title?: string;
  name?: string;
  avatar?: string;
  location?: string;
  country: string;
  last_online: number;
  joined: number;
  status: string;
  is_streamer: boolean;
  verified: boolean;
  league?: string;
};

export type PlayerProfile = Player & {
  stats?: PlayerStats;
};

