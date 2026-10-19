import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { GameConfig } from "../types";
import { PixelBadge } from "./PixelWorld";
import { themes } from "../data/themes";
import { formatAltitude, getDailyKey, loadRecord } from "../lib/game";
import { currentStreak, loadProfile } from "../lib/retention";

export function Challenges({ onStart, onRecords }: { onStart: (config: GameConfig) => void; onRecords: () => void }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const profile = loadProfile();
  const record = loadRecord("crowd", "daily");
  const today = now ? getDailyKey(now) : "";
  const completed = Boolean(today && (Object.hasOwn(profile.dailyScores, today) || record.lastDaily === today));
  const midnight = now ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) : null;
  const minutes = now && midnight ? Math.ceil((midnight.getTime() - now.getTime()) / 60_000) : 0;

  return (
    <section className="challenges-section" id="challenges" aria-labelledby="challenges-title">
      <div className="retention-heading"><div><span className="guide-kicker">COME BACK FOR A NEW BOARD</span><h2 id="challenges-title">Your daily dose of instinct.</h2></div><button className="text-button" onClick={onRecords}>My records <ArrowRight size={16} /></button></div>
      <div className="daily-card">
        <div>
          <span className="guide-kicker">DAILY CROWD 100 {today && `· ${today}`}</span>
          <h3>{completed ? "Today's challenge is complete." : "One date. The same ten prompts."}</h3>
          <p>{completed && Object.hasOwn(profile.dailyScores, today) ? `First completed run: ${profile.dailyScores[today].toLocaleString()} pts. ` : ""}Your first completed run counts toward your daily record. Replays are practice.</p>
          <div className="daily-status"><span>{now ? currentStreak(record, now) : 0} day streak</span><span>{now ? `New board in ${Math.floor(minutes / 60)}h ${minutes % 60}m` : "New board at local midnight"}</span></div>
        </div>
        <button className="primary-button" onClick={() => onStart({ mode: "crowd", variant: "daily" })}>{completed ? "Replay today's board" : "Play today's challenge"}<ArrowRight size={18} /></button>
      </div>
      <div className="retention-heading theme-heading"><div><span className="guide-kicker">ORIGINAL THEME PACKS</span><h2>Pick a little world to climb.</h2><p>7 original prompts · 15 seconds each · up to 7,000 m. Fixed boards you can share with friends.</p></div></div>
      <div className="theme-grid">
        {themes.map((theme, index) => <article className={`theme-card theme-${theme.id}`} key={theme.id}>
          <PixelBadge kind={index === 0 ? "star" : index === 1 ? "tree" : "house"} /><span className="guide-kicker">THEME 0{index + 1}</span><h3>{theme.name}</h3><p>{theme.description}</p>
          <span className="record-line">{Object.hasOwn(profile.themeBests, theme.id) ? `Your best: ${formatAltitude(profile.themeBests[theme.id] * 10)}` : "Your first climb awaits"}</span>
          <button className="mode-play" onClick={() => onStart({ mode: "climb", variant: "classic", theme: theme.id })}>Play {theme.name}<ArrowRight size={16} /></button>
        </article>)}
      </div>
      <p className="retention-note">Rankings are editorial estimates, not live survey results. Records stay in this browser.</p>
    </section>
  );
}
