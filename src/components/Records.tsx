import { ArrowLeft, ArrowRight } from "lucide-react";
import type { GameConfig } from "../types";
import { themes } from "../data/themes";
import { formatAltitude, loadRecord } from "../lib/game";
import { challengeLabel, currentStreak, loadProfile } from "../lib/retention";

export function Records({ onHome, onStart }: { onHome: () => void; onStart: (config: GameConfig) => void }) {
  const profile = loadProfile();
  const daily = loadRecord("crowd", "daily");
  const classic = loadRecord("climb", "classic");
  return <div className="home-page"><header className="site-header"><button className="play-brand" onClick={onHome}><ArrowLeft size={17} />NOILLIRK</button><span className="guide-kicker">MY RECORDS</span></header>
    <main className="content-page records-page"><h1>Your instinct, over time.</h1><p>Personal records saved in this browser. Clearing browser data removes them; they do not sync across devices.</p>
      <div className="summary-metrics"><div><span>DAILY STREAK</span><strong>{currentStreak(daily)} days</strong></div><div><span>DAILY BEST</span><strong>{daily.best.toLocaleString()} pts</strong></div><div><span>CLASSIC BEST</span><strong>{formatAltitude(classic.best * 10)}</strong></div><div><span>RECENT RUNS</span><strong>{profile.history.length}</strong></div></div>
      <h2>Theme personal bests</h2><div className="records-themes">{themes.map((theme) => <div key={theme.id}><span>{theme.name}</span><strong>{Object.hasOwn(profile.themeBests, theme.id) ? formatAltitude(profile.themeBests[theme.id] * 10) : "Not played yet"}</strong></div>)}</div>
      <h2>Last 30 completed runs</h2>
      {profile.history.length === 0 ? <div className="daily-card"><div><h3>Your story starts with one run.</h3><p>Finish a game to save its score here. Existing personal bests above are preserved.</p></div><button className="primary-button" onClick={() => onStart({ mode: "crowd", variant: "daily" })}>Play today's challenge<ArrowRight size={18} /></button></div> :
        <ol className="run-history">{profile.history.map((run) => <li key={run.id}><div><strong>{challengeLabel(run.config)}</strong><time dateTime={run.completedAt}>{new Date(run.completedAt).toLocaleString()}</time><span>{run.rounds} rounds · {run.perfects} top answers{run.firstDaily ? " · Daily record" : ""}</span></div><strong>{run.config.mode === "climb" ? formatAltitude(run.score * 10) : `${run.score.toLocaleString()} pts`}</strong><button className="text-button" onClick={() => onStart({ ...run.config, practice: run.config.variant === "daily" })}>Replay <ArrowRight size={15} /></button></li>)}</ol>}
    </main></div>;
}
