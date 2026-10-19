import { useEffect, useState } from "react";
import type { GameConfig, GameSummary, RoundResult } from "./types";
import { completeRun, configFromSearch, prepareGame } from "./lib/retention";
import { Records } from "./components/Records";
import { Home } from "./components/Home";
import { GameScreen } from "./components/GameScreen";
import { SummaryScreen } from "./components/SummaryScreen";
import { Multiplayer } from "./components/Multiplayer";
import { ContentPage } from "./components/ContentPage";
import { findContentPage } from "./data/pages";

type View =
  | { name: "home" }
  | { name: "game"; config: GameConfig }
  | { name: "summary"; config: GameConfig; summary: GameSummary; results: RoundResult[]; saved: boolean }
  | { name: "records" }
  | { name: "room" };

export default function App() {
  const page = findContentPage(window.location.pathname);
  const [view, setView] = useState<View>(() => {
    const config = configFromSearch(window.location.search);
    if (!page && config) return { name: "game", config };
    return { name: "home" };
  });

  useEffect(() => {
    if (page) document.title = page.title;
  }, [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view.name]);

  const start = (config: GameConfig) => {
    setView({ name: "game", config: prepareGame(config) });
  };

  const finish = (config: GameConfig, summary: GameSummary, results: RoundResult[]) => {
    const savedRun = completeRun(config, summary);
    setView({ name: "summary", config: savedRun.config, summary, results, saved: savedRun.saved });
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
        saved={view.saved}
        onRecords={() => setView({ name: "records" })}
        onReplay={() =>
          start({
            ...view.config,
            practice: view.config.variant === "daily"
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
  if (view.name === "records") return <Records onHome={() => setView({ name: "home" })} onStart={start} />;

  if (page) return <ContentPage page={page} />;
  return <Home onStart={start} onOpenRoom={() => setView({ name: "room" })} onRecords={() => setView({ name: "records" })} />;
}
