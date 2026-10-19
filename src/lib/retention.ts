import type { GameConfig, GameSummary, RoundResult, StoredRecord } from "../types";
import { getTheme } from "../data/themes";
import { formatAltitude, getDailyKey, loadRecord, saveRecord } from "./game";

export interface RunRecord {
  id: string;
  completedAt: string;
  config: GameConfig;
  score: number;
  rounds: number;
  perfects: number;
  firstDaily: boolean;
}
interface Profile {
  history: RunRecord[];
  dailyScores: Record<string, number>;
  themeBests: Record<string, number>;
}
const profileKey = "noillirk-games:profile:v1";
const finiteScore = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
export const validDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;

export function loadProfile(): Profile {
  try {
    const data = JSON.parse(localStorage.getItem(profileKey) ?? "{}");
    const scores = (input: unknown) => Object.fromEntries(Object.entries(input && typeof input === "object" ? input : {}).filter(([, value]) => finiteScore(value))) as Record<string, number>;
    return {
      history: Array.isArray(data.history) ? data.history.filter((entry: RunRecord) =>
        entry && typeof entry.id === "string" && typeof entry.completedAt === "string" && !Number.isNaN(Date.parse(entry.completedAt)) &&
        entry.config && ["crowd", "climb"].includes(entry.config.mode) &&
        ["daily", "classic", "unlimited", "endless"].includes(entry.config.variant) &&
        (!entry.config.theme || getTheme(entry.config.theme)) && finiteScore(entry.score) && finiteScore(entry.rounds) && finiteScore(entry.perfects)
      ).slice(0, 30) : [],
      dailyScores: scores(data.dailyScores),
      themeBests: scores(data.themeBests)
    };
  } catch { return { history: [], dailyScores: {}, themeBests: {} }; }
}

export function currentStreak(record: StoredRecord, now = new Date()) {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return record.lastDaily === getDailyKey(now) || record.lastDaily === getDailyKey(yesterday) ? record.streak : 0;
}

export function prepareGame(config: GameConfig, now = new Date()): GameConfig {
  const theme = getTheme(config.theme);
  if (theme) return { mode: "climb", variant: "classic", theme: theme.id, seed: `theme-v1-${theme.id}` };
  if (config.variant === "daily") {
    const today = getDailyKey(now);
    const day = config.dailyKey && validDay(config.dailyKey) && config.dailyKey <= today ? config.dailyKey : today;
    const previous = loadRecord("crowd", "daily");
    return { mode: "crowd", variant: "daily", dailyKey: day, seed: `crowd-daily-${day}`,
      practice: Boolean(config.practice || day !== today || (previous.lastDaily && previous.lastDaily >= day) || Object.hasOwn(loadProfile().dailyScores, day)) };
  }
  return { ...config, theme: undefined, seed: config.seed ?? `${config.mode}-${config.variant}-${now.getTime()}` };
}

export function configFromSearch(search: string, now = new Date()): GameConfig | null {
  const params = new URLSearchParams(search);
  const theme = getTheme(params.get("theme") ?? undefined);
  if (theme) return prepareGame({ mode: "climb", variant: "classic", theme: theme.id }, now);
  const mode = params.get("play");
  if (mode !== "crowd" && mode !== "climb") return null;
  const variant = params.get("variant");
  const config: GameConfig = { mode, variant: mode === "crowd" ? variant === "unlimited" ? "unlimited" : "daily" : variant === "endless" ? "endless" : "classic" };
  const day = params.get("day");
  if (day && validDay(day)) config.dailyKey = day;
  const seed = params.get("seed");
  if (seed && /^[a-zA-Z0-9-]{1,80}$/.test(seed)) config.seed = seed;
  return prepareGame(config, now);
}

export function completeRun(config: GameConfig, summary: GameSummary, now = new Date()) {
  const profile = loadProfile();
  const record = loadRecord(config.mode, config.variant);
  const day = config.dailyKey ?? getDailyKey(now);
  const firstDaily = config.variant === "daily" && !config.practice && !Object.hasOwn(profile.dailyScores, day) && (!record.lastDaily || day > record.lastDaily);
  const storedConfig = { ...config, practice: config.variant === "daily" ? !firstDaily : undefined };
  if (firstDaily) profile.dailyScores[day] = summary.score;
  // Practice and themes must not inflate the standard daily/classic records.
  if (config.theme) profile.themeBests[config.theme] = Math.max(profile.themeBests[config.theme] ?? 0, summary.score);
  else if (config.variant !== "daily" || firstDaily) saveRecord(config.mode, config.variant, summary.score, day);
  const entry: RunRecord = { id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`, completedAt: now.toISOString(), config: storedConfig, score: summary.score, rounds: summary.rounds, perfects: summary.perfects, firstDaily };
  profile.history = [entry, ...profile.history].slice(0, 30);
  profile.dailyScores = Object.fromEntries(Object.entries(profile.dailyScores).sort(([a], [b]) => b.localeCompare(a)).slice(0, 90));
  try {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    return { saved: true, config: storedConfig, firstDaily };
  } catch { return { saved: false, config: storedConfig, firstDaily }; }
}

export function challengeLabel(config: GameConfig) {
  const theme = getTheme(config.theme);
  if (theme) return theme.name;
  if (config.variant === "daily") return `Daily ${config.dailyKey ?? ""}${config.practice ? " · Practice" : ""}`;
  return `${config.mode === "crowd" ? "Crowd 100" : "Sky Climb"} · ${config.variant === "unlimited" ? "Unlimited" : config.variant === "endless" ? "Endless" : "Classic"}`;
}

export function challengeUrl(config: GameConfig, origin: string, source?: "x.com") {
  const url = new URL("/", origin);
  url.searchParams.set("play", config.mode);
  url.searchParams.set("variant", config.variant);
  if (config.theme) url.searchParams.set("theme", config.theme);
  else if (config.variant === "daily") url.searchParams.set("day", config.dailyKey ?? getDailyKey());
  else if (config.seed) url.searchParams.set("seed", config.seed);
  if (source) {
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", "social");
    url.searchParams.set("utm_campaign", "result_share");
    url.searchParams.set("utm_content", "scorecard");
  }
  return url.toString();
}

export function resultShareText(config: GameConfig, summary: GameSummary, results: RoundResult[]) {
  const tiles = results.map((result) => result.rank === 1 ? "🟩" : result.rank >= 2 && result.rank <= 5 ? "🟨" : result.points > 0 ? "🟧" : "⬛");
  const rows = Array.from({ length: Math.ceil(tiles.length / 10) }, (_, index) => tiles.slice(index * 10, index * 10 + 10).join(""));
  const score = config.mode === "crowd" ? `${summary.score} pts · ${summary.crowd}/100 people` : `${formatAltitude(summary.altitude)} · ${summary.score} pts`;
  return [`Noillirk · ${challengeLabel(config)}`, `${score} · ${summary.rounds} rounds`, ...rows, "Same prompts. Your turn."].join("\n");
}
