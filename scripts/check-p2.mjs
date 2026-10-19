import assert from "node:assert/strict";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
try {
  const r = await server.ssrLoadModule("/src/lib/retention.ts");
  const g = await server.ssrLoadModule("/src/lib/game.ts");
  const { themes } = await server.ssrLoadModule("/src/data/themes.ts");
  const summary = { mode: "crowd", variant: "daily", score: 800, altitude: 8000, crowd: 32, rounds: 10, perfects: 2, offBoard: 2, title: "Test" };
  const day1 = new Date(2026, 9, 19, 12);
  const day2 = new Date(2026, 9, 20, 12);
  const daily = r.prepareGame({ mode: "crowd", variant: "daily" }, day1);
  const first = r.completeRun(daily, summary, day1);
  assert.equal(first.firstDaily, true);
  assert.equal(r.loadProfile().dailyScores["2026-10-19"], 800);
  assert.equal(g.loadRecord("crowd", "daily").streak, 1);
  const replay = r.prepareGame(daily, day1);
  assert.equal(replay.practice, true);
  assert.equal(replay.seed, daily.seed, "Daily replay must not become a random board");
  r.completeRun(replay, { ...summary, score: 2600 }, day1);
  assert.equal(g.loadRecord("crowd", "daily").best, 800, "Practice cannot overwrite daily record");
  assert.equal(r.loadProfile().dailyScores["2026-10-19"], 800);
  // A second tab may have started before the first tab finished.
  assert.equal(r.completeRun(daily, { ...summary, score: 2600 }, day1).firstDaily, false);
  r.completeRun(r.prepareGame({ mode: "crowd", variant: "daily" }, day2), summary, day2);
  assert.equal(g.loadRecord("crowd", "daily").streak, 2);
  assert.equal(r.currentStreak(g.loadRecord("crowd", "daily"), new Date(2026, 9, 22, 12)), 0, "Expired streak is not shown as active");
  const pastLink = r.configFromSearch("?play=crowd&day=2026-10-19", day2);
  assert.equal(pastLink.practice, true);
  assert.equal(pastLink.seed, daily.seed);
  const sharedDaily = new URL(r.challengeUrl(daily, "https://noillirk.games"));
  assert.equal(r.configFromSearch(sharedDaily.search, day1).seed, daily.seed);
  assert.equal(r.validDay("2026-02-30"), false);
  assert.equal(r.configFromSearch("?play=invalid", day1), null);
  assert.equal(r.configFromSearch("?play=crowd&day=2099-01-01", day1).dailyKey, "2026-10-19");

  const allIds = new Set();
  for (const theme of themes) {
    assert.equal(theme.questions.length, 7);
    for (const question of theme.questions) {
      assert.ok(!allIds.has(question.id)); allIds.add(question.id);
      assert.equal(question.answers.length, 12);
      question.answers.forEach((answer, i) => assert.equal(g.findRank(question, answer), i + 1));
    }
    const config = r.prepareGame({ mode: "climb", variant: "classic", theme: theme.id }, day1);
    const roundtrip = r.configFromSearch(new URL(r.challengeUrl(config, "https://noillirk.games")).search, day2);
    assert.deepEqual(roundtrip, config, "Theme share opens the identical challenge");
    assert.equal(new Set(g.pickQuestions(7, config.seed, theme.questions).map((q) => q.id)).size, 7);
    r.completeRun(config, { ...summary, mode: "climb", variant: "classic", score: 500 }, day1);
    assert.equal(r.loadProfile().themeBests[theme.id], 500);
  }
  assert.equal(g.loadRecord("climb", "classic").best, 0, "Theme records stay separate from standard Classic");
  const { Records } = await server.ssrLoadModule("/src/components/Records.tsx");
  const recordsHtml = renderToStaticMarkup(createElement(Records, { onHome() {}, onStart() {} }));
  assert.match(recordsHtml, /Comfort Kitchen/);
  assert.match(recordsHtml, /5\.0 km/, "Theme best is rendered in metres converted once");
  assert.match(recordsHtml, /Daily record/);
  assert.match(recordsHtml, /Practice/);
  assert.match(recordsHtml, /Replay/);
  const regular = r.prepareGame({ mode: "climb", variant: "endless" }, day1);
  assert.equal(r.configFromSearch(new URL(r.challengeUrl(regular, "https://noillirk.games")).search, day2).seed, regular.seed);
  const result = g.scoreRound("climb", themes[0].questions[0], "Butter", 0);
  const text = r.resultShareText(daily, summary, [result, { ...result, rank: 0, points: 0 }]);
  assert.match(text, /🟩⬛/);
  assert.doesNotMatch(text, /Butter|toast/, "Shared cards must not reveal answers or prompts");
  const social = new URL(r.challengeUrl(daily, "https://noillirk.games", "x.com"));
  assert.equal(social.searchParams.get("utm_source"), "x.com");
  assert.equal(social.searchParams.get("utm_medium"), "social");
  assert.equal(social.searchParams.get("day"), daily.dailyKey);
  assert.equal(sharedDaily.searchParams.has("utm_source"), false, "Do not invent a source for native/copy sharing");
  for (let i = 0; i < 35; i++) r.completeRun(replay, summary, day1);
  assert.equal(r.loadProfile().history.length, 30);

  memory.clear();
  const lateStart = r.prepareGame({ mode: "crowd", variant: "daily" }, new Date(2026, 9, 19, 23, 59));
  r.completeRun(lateStart, summary, new Date(2026, 9, 20, 0, 2));
  assert.equal(g.loadRecord("crowd", "daily").lastDaily, "2026-10-19", "Cross-midnight run keeps its starting date");
  memory.set("noillirk-games:profile:v1", '{"history":[null,{}],"dailyScores":null}');
  assert.deepEqual(r.loadProfile().history, []);
  Object.defineProperty(globalThis, "localStorage", { value: { getItem() { throw new Error("Blocked"); }, setItem() { throw new Error("Blocked"); } }, configurable: true });
  assert.equal(r.loadProfile().history.length, 0);
  const emptyHtml = renderToStaticMarkup(createElement(Records, { onHome() {}, onStart() {} }));
  assert.match(emptyHtml, /Your story starts with one run/);
  assert.equal(r.completeRun(daily, summary, day1).saved, false);
  console.log("P2 checks passed: daily/practice/streaks, midnight, 21 theme questions, records, share roundtrips, attribution, and blocked storage.");
} finally {
  delete globalThis.localStorage;
  await server.close();
}
