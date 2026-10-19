import { questions } from "../data/questions";
import type { GameMode, Question, RoundResult, StoredRecord, Variant } from "../types";

const crowdMultipliers = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4];

export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }

  return previous[b.length];
}

export function findRank(question: Question, value: string): number {
  const normalized = normalizeAnswer(value);
  if (!normalized) return 0;

  const candidates = [...question.answers, ...(question.extraAccepted ?? [])].flatMap((answer, index) =>
    [answer, ...(question.aliases?.[answer] ?? [])].map((label) => ({
      value: normalizeAnswer(label),
      rank: index < question.answers.length ? index + 1 : 13
    }))
  );
  // Exact answers (including extra accepted answers) always take priority over typos.
  const exact = candidates.find((candidate) => candidate.value === normalized);
  if (exact) return exact.rank;

  const withoutArticle = (answer: string) => answer.replace(/^(?:a|an|the) /, "");
  const singular = (answer: string) =>
    answer.length > 3 && /s$/.test(answer) && !/(ss|us|is)$/.test(answer)
      ? answer.slice(0, -1)
      : answer;
  const comparable = (answer: string) => singular(withoutArticle(answer));
  const uniqueRank = (ranks: number[]) => new Set(ranks).size === 1 ? ranks[0] : 0;
  const variants = candidates.filter((candidate) => comparable(candidate.value) === comparable(normalized));
  if (variants.length) return uniqueRank(variants.map((candidate) => candidate.rank));

  const typos = candidates.filter((candidate) =>
    candidate.value.length >= 5 && normalized.length >= 5 && editDistance(candidate.value, normalized) <= 1
  );
  return uniqueRank(typos.map((candidate) => candidate.rank));
}

export function crowdBaseForRank(rank: number): number {
  if (rank <= 0) return 0;
  if (rank === 1) return 100;
  if (rank <= 3) return 75;
  if (rank <= 5) return 50;
  if (rank <= 10) return 25;
  return 10;
}

export function climbBaseForRank(rank: number): number {
  if (rank <= 0) return 0;
  if (rank === 1) return 100;
  if (rank <= 4) return 64;
  if (rank <= 9) return 32;
  if (rank === 10) return 16;
  if (rank === 11) return 8;
  return 4;
}

export function scoreRound(
  mode: GameMode,
  question: Question,
  answer: string,
  roundIndex: number
): RoundResult {
  const rank = findRank(question, answer);
  const base = mode === "crowd" ? crowdBaseForRank(rank) : climbBaseForRank(rank);
  const multiplier = mode === "crowd" ? (crowdMultipliers[roundIndex] ?? 1) : 1;
  const points = base * multiplier;

  return {
    questionId: question.id,
    prompt: question.prompt,
    answer: answer.trim(),
    matchedAnswer: rank > 0 && rank <= question.answers.length ? question.answers[rank - 1] : undefined,
    outcome: rank > 0 ? "matched" : "unrecognized",
    rank: rank || 0,
    base,
    multiplier,
    points,
    crowdJoined: Math.floor(points / 25),
    topAnswers: question.answers.slice(0, 5)
  };
}

export function crowdCount(score: number): number {
  return Math.min(100, Math.floor(score / 25));
}

export function getGameTitle(perfects: number, offBoard: number, rounds: number): string {
  if (perfects >= Math.max(3, Math.ceil(rounds / 2))) return "Mind Reader";
  if (perfects >= 2 && offBoard >= 3) return "Hit or Miss";
  if (perfects >= 2) return "Crowd Whisperer";
  if (offBoard >= Math.ceil(rounds / 2)) return "Own Lane";
  if (perfects === 1) return "Close Call";
  return "Free Thinker";
}

export function getDailyKey(date = new Date()): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickQuestions(count: number, seed: string, bank: Question[] = questions): Question[] {
  if (count > 0 && bank.length === 0) throw new Error("Question bank is empty");
  const random = mulberry32(hashString(seed));
  const pool = [...bank];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const chosen: Question[] = [];
  while (chosen.length < count) {
    const next = pool.shift();
    if (!next) {
      pool.push(...bank);
      continue;
    }
    chosen.push(next);
  }
  return chosen;
}

export function configForVariant(variant: Variant): { rounds: number; seconds: number } {
  if (variant === "daily" || variant === "unlimited") {
    return { rounds: variant === "daily" ? 10 : 20, seconds: 30 };
  }
  if (variant === "classic") return { rounds: 7, seconds: 15 };
  if (variant === "endless") return { rounds: 99, seconds: 15 };
  return { rounds: 7, seconds: 15 };
}

export function formatAltitude(metres: number): string {
  if (metres >= 1000) return `${(metres / 1000).toFixed(1)} km`;
  return `${metres} m`;
}

export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

const storagePrefix = "noillirk-games:";

export function loadRecord(mode: GameMode, variant: Variant): StoredRecord {
  const fallback: StoredRecord = { best: 0, plays: 0, lastPlayed: "", streak: 0, lastDaily: null };
  try {
    const raw = localStorage.getItem(`${storagePrefix}${mode}:${variant}`);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveRecord(
  mode: GameMode,
  variant: Variant,
  score: number,
  dailyKey: string
): StoredRecord {
  const previous = loadRecord(mode, variant);
  let streak = previous.streak;
  if (variant === "daily" && dailyKey !== previous.lastDaily) {
    const yesterday = new Date(`${dailyKey}T12:00:00`);
    yesterday.setDate(yesterday.getDate() - 1);
    const expected = getDailyKey(yesterday);
    streak = previous.lastDaily === expected ? previous.streak + 1 : 1;
  }
  const next: StoredRecord = {
    best: Math.max(previous.best, score),
    plays: previous.plays + 1,
    lastPlayed: new Date().toISOString(),
    streak,
    lastDaily: variant === "daily" ? dailyKey : previous.lastDaily
  };
  try {
    localStorage.setItem(`${storagePrefix}${mode}:${variant}`, JSON.stringify(next));
  } catch {
    // Browsers can block storage in private contexts; the game still works.
  }
  return next;
}

export function buildShareText(args: {
  mode: GameMode;
  score: number;
  crowd: number;
  altitude: number;
  rounds: number;
  code?: string;
}): string {
  if (args.mode === "crowd") {
    return `I pulled ${args.crowd}/100 people in Noillirk. Can you read the crowd better?`;
  }
  return `I climbed ${formatAltitude(args.altitude)} in ${args.rounds} rounds. Beat my instinct?`;
}
