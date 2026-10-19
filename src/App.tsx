import { useEffect, useState } from "react";
import type { GameConfig, GameSummary, RoundResult } from "./types";
import { getDailyKey, saveRecord } from "./lib/game";
import { Home } from "./components/Home";
import { GameScreen } from "./components/GameScreen";
import { SummaryScreen } from "./components/SummaryScreen";
import { Multiplayer } from "./components/Multiplayer";

type View =
  | { name: "home" }
  | { name: "game"; config: GameConfig }
  | { name: "summary"; config: GameConfig; summary: GameSummary; results: RoundResult[] }
  | { name: "room" };

export default function App() {
  const [view, setView] = useState<View>({ name: "home" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view.name]);

  const start = (config: GameConfig) => {
    setView({ name: "game", config });
  };

  const finish = (config: GameConfig, summary: GameSummary, results: RoundResult[]) => {
    saveRecord(config.mode, config.variant, summary.score, getDailyKey());
    setView({ name: "summary", config, summary, results });
  };

  if (view.name === "game") {
    return (
      <GameScreen
        config={view.config}
        onExit={() => setView({ name: "home" })}
        onFinish={(summary, results) => finish(view.config, summary, results)}
      />
    );
  }

  if (view.name === "summary") {
    return (
      <SummaryScreen
        summary={view.summary}
        results={view.results}
        config={view.config}
        onReplay={() =>
          start({
            ...view.config,
            seed: `${view.config.mode}-${view.config.variant}-${Date.now()}`
          })
        }
        onHome={() => setView({ name: "home" })}
        onOtherMode={() =>
          start({
            mode: view.summary.mode === "crowd" ? "climb" : "crowd",
            variant: view.summary.mode === "crowd" ? "classic" : "daily"
          })
        }
      />
    );
  }

  if (view.name === "room") {
    return <Multiplayer onBack={() => setView({ name: "home" })} />;
  }

  return <Home onStart={start} onOpenRoom={() => setView({ name: "room" })} />;
}
