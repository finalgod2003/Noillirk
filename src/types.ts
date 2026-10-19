export type GameMode = "crowd" | "climb";

export type Variant = "daily" | "unlimited" | "classic" | "endless" | "room";

export interface Question {
  id: string;
  category: string;
  prompt: string;
  answers: string[];
  extraAccepted?: string[];
  aliases?: Record<string, string[]>;
}

export interface GameConfig {
  mode: GameMode;
  variant: Variant;
  seed?: string;
  roomCode?: string;
  playerName?: string;
  dailyKey?: string;
  practice?: boolean;
  theme?: string;
}

export interface RoundResult {
  questionId: string;
  prompt: string;
  answer: string;
  rank: number;
  base: number;
  multiplier: number;
  points: number;
  crowdJoined: number;
  topAnswers: string[];
  matchedAnswer?: string;
  outcome?: "matched" | "unrecognized" | "passed" | "timeout";
}

export interface GameSummary {
  score: number;
  crowd: number;
  altitude: number;
  perfects: number;
  offBoard: number;
  title: string;
  mode: GameMode;
  variant: Variant;
  rounds: number;
}

export interface StoredRecord {
  best: number;
  plays: number;
  lastPlayed: string;
  streak: number;
  lastDaily: string | null;
}

export interface RoomPlayer {
  id: string;
  name: string;
  score: number;
  submitted: boolean;
}

export interface RoomRevealRow {
  playerId: string;
  name: string;
  answer: string;
  rank: number;
  points: number;
}

export interface RoomSnapshot {
  code: string;
  status: "lobby" | "playing" | "reveal" | "finished";
  mode: GameMode;
  variant: "room";
  rounds: number;
  seconds: number;
  round: number;
  hostId: string;
  players: RoomPlayer[];
  prompt?: string;
  category?: string;
  endsAt?: number;
  reveal?: {
    rows: RoomRevealRow[];
    topAnswers: string[];
  };
  createdAt: number;
}

export interface RoomApi {
  create: (input: {
    name: string;
    mode: GameMode;
    rounds: number;
    seconds: number;
  }) => Promise<{ code: string; playerId: string }>;
  join: (code: string, name: string) => Promise<{ playerId: string }>;
  start: (code: string, playerId: string) => Promise<RoomSnapshot>;
  state: (code: string, playerId: string) => Promise<RoomSnapshot>;
  answer: (code: string, playerId: string, text: string) => Promise<RoomSnapshot>;
  next: (code: string, playerId: string) => Promise<RoomSnapshot>;
}
