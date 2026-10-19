import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import type { GameConfig, GameSummary, RoundResult } from "../types";
import {
  climbBaseForRank,
  configForVariant,
  crowdCount,
  getDailyKey,
  getGameTitle,
  pickQuestions,
  scoreRound
} from "../lib/game";
import { ClimbField, CrowdField } from "./Visuals";

type Phase = "asking" | "revealed";

const rankLabel = (rank: number, mode: GameConfig["mode"]) => {
  if (rank === 0) return "Off the board";
  if (rank === 1) return "#1 answer";
  if (mode === "crowd") {
    if (rank <= 3) return "Runner-up";
    if (rank <= 5) return "Top five";
    if (rank <= 10) return "Top ten";
    return "Off the board";
  }
  if (rank <= 4) return "Jet stream";
  if (rank <= 9) return "Cloud nine";
  if (rank === 10) return "Kite";
  if (rank === 11) return "Treetop";
  return "Grounded";
};

export function GameScreen({
  config,
  onExit,
  onFinish
}: {
  config: GameConfig;
  onExit: () => void;
  onFinish: (summary: GameSummary, results: RoundResult[]) => void;
}) {
  const dailyKey = getDailyKey();
  const gameSettings = configForVariant(config.variant);
  const roundLimit =
    config.variant === "endless" ? 30 : config.variant === "unlimited" ? 20 : gameSettings.rounds;
  const [roundQuestions] = useState(() =>
    pickQuestions(
      config.variant === "endless" ? 50 : roundLimit,
      config.seed ??
        (config.variant === "daily"
          ? `${config.mode}-daily-${dailyKey}`
          : `${config.mode}-${config.variant}-${Date.now()}`)
    )
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("asking");
  const [timeLeft, setTimeLeft] = useState(gameSettings.seconds);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [input, setInput] = useState("");
  const [perfects, setPerfects] = useState(0);
  const [offBoard, setOffBoard] = useState(0);
  const [balloons, setBalloons] = useState(3);
  const [soundOn, setSoundOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const question = roundQuestions[roundIndex];
  const crowd = crowdCount(score);
  const multiplier = config.mode === "crowd" ? [1, 1, 2, 2, 2, 3, 3, 3, 4, 4][roundIndex] ?? 1 : 1;

  const playTone = (kind: "hit" | "miss" | "next") => {
    if (!soundOn) return;
    try {
      const AudioContextClass =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "miss" ? "sawtooth" : "sine";
      oscillator.frequency.value = kind === "hit" ? 520 : kind === "miss" ? 150 : 330;
      gain.gain.setValueAtTime(0.06, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.17);
    } catch {
      // Audio is a flourish; the game remains fully playable without it.
    }
  };

  const finish = (finalScore: number, finalResults: RoundResult[]) => {
    const finalPerfects = finalResults.filter((result) => result.rank === 1).length;
    const finalOffBoard = finalResults.filter((result) => result.rank > 10 || result.rank === 0).length;
    onFinish(
      {
        score: finalScore,
        crowd: crowdCount(finalScore),
        altitude: finalScore * 10,
        perfects: finalPerfects,
        offBoard: finalOffBoard,
        title: getGameTitle(finalPerfects, finalOffBoard, finalResults.length || 1),
        mode: config.mode,
        variant: config.variant,
        rounds: finalResults.length
      },
      finalResults
    );
  };

  const commitMiss = () => {
    if (phase !== "asking") return;
    const miss: RoundResult = {
      questionId: question.id,
      prompt: question.prompt,
      answer: "—",
      rank: 0,
      base: 0,
      multiplier,
      points: 0,
      crowdJoined: 0,
      topAnswers: question.answers.slice(0, 5)
    };
    const nextResults = [...results, miss];
    setResults(nextResults);
    setLastResult(miss);
    setPhase("revealed");
    setOffBoard((value) => value + 1);
    if (config.mode === "climb" && config.variant === "endless") {
      setBalloons((value) => Math.max(0, value - 1));
    }
    playTone("miss");
  };

  useEffect(() => {
    if (phase !== "asking") return;
    const endsAt = Date.now() + gameSettings.seconds * 1000;
    setTimeLeft(gameSettings.seconds);
    inputRef.current?.focus();
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, (endsAt - Date.now()) / 1000);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
        commitMiss();
      }
    }, 100);
    return () => window.clearInterval(timer);
    // The round index intentionally resets the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIndex, gameSettings.seconds]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (phase !== "asking") return;
    const answer = input.trim();
    if (!answer) return;
    const result = scoreRound(config.mode, question, answer, roundIndex);
    const nextResults = [...results, result];
    const nextScore = score + result.points;
    setResults(nextResults);
    setScore(nextScore);
    setLastResult(result);
    setPhase("revealed");
    setInput("");
    if (result.rank === 1) {
      setPerfects((value) => value + 1);
      if (config.mode === "climb") setBalloons(3);
    }
    if (result.rank > 10 || result.rank === 0) setOffBoard((value) => value + 1);
    playTone(result.rank === 1 ? "hit" : "next");
  };

  const next = () => {
    const lastRound = roundIndex + 1 >= roundLimit;
    const outOfBalloons = config.variant === "endless" && balloons <= 0;
    if (lastRound || outOfBalloons) {
      finish(score, results);
      return;
    }
    setRoundIndex((value) => value + 1);
    setPhase("asking");
    setLastResult(null);
    setInput("");
  };

  const baseLabel =
    config.mode === "crowd"
      ? `${rankLabel(lastResult?.rank ?? 0, "crowd")} · ×${multiplier}`
      : `+${climbBaseForRank(lastResult?.rank ?? 0)} base`;

  return (
    <div className={`play-page play-${config.mode}`}>
      <header className="play-header">
        <button className="play-brand" onClick={onExit} aria-label="Leave game">
          <ArrowLeft size={17} />
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <strong>NOILLIRK</strong>
        </button>
        <div className="play-header-center">
          <span className="mode-chip">
            {config.mode === "crowd" ? "CROWD 100" : "SKY CLIMB"}
          </span>
          <span className="round-chip">
            {String(roundIndex + 1).padStart(2, "0")} /{" "}
            {config.variant === "endless" ? "∞" : String(roundLimit).padStart(2, "0")}
          </span>
        </div>
        <div className="play-header-actions">
          <button
            className="icon-button"
            onClick={() => setSoundOn((value) => !value)}
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
          >
            {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button className="icon-button" onClick={onExit} aria-label="End run">
            <X size={18} />
          </button>
        </div>
      </header>

      <main className="play-main">
        <section className="prompt-panel">
          <div className="prompt-topline">
            <span>{question.category}</span>
            <span className={timeLeft <= 5 && phase === "asking" ? "clock is-urgent" : "clock"}>
              <Clock3 size={14} />
              {Math.ceil(timeLeft)}s
            </span>
          </div>
          <h1>{question.prompt}</h1>
          <div className="prompt-progress">
            <span style={{ width: `${Math.max(0, (timeLeft / gameSettings.seconds) * 100)}%` }} />
          </div>
          <div className="prompt-meta">
            <span>
              {config.mode === "crowd"
                ? `${score.toLocaleString()} pts · ${crowd}/100 pulled`
                : `${(score * 10).toLocaleString()} m · ${balloons} balloon${balloons === 1 ? "" : "s"}`}
            </span>
            {config.mode === "crowd" && <span>Question value ×{multiplier}</span>}
          </div>
        </section>

        <section className="visual-panel">
          {config.mode === "crowd" ? (
            <CrowdField crowd={crowd} reveal={lastResult ?? undefined} pulseKey={roundIndex} />
          ) : (
            <ClimbField
              points={score}
              balloons={balloons}
              reveal={lastResult ?? undefined}
              pulseKey={roundIndex}
            />
          )}
        </section>

        <AnimatePresence mode="wait">
          {phase === "asking" ? (
            <motion.form
              className="answer-dock"
              key={`answer-${roundIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={submit}
            >
              <label htmlFor="answer-input">
                <span>YOUR ANSWER</span>
                <span className="answer-hint">Say the first thing the room would say.</span>
              </label>
              <div className="answer-row">
                <input
                  id="answer-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="What would most people say?"
                  autoComplete="off"
                  maxLength={60}
                />
                <button className="pass-button" type="button" onClick={commitMiss}>
                  Pass
                </button>
                <button className="submit-button" type="submit" disabled={!input.trim()}>
                  <ArrowRight size={19} />
                  <span>Submit</span>
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.section
              className="reveal-dock"
              key={`reveal-${roundIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="reveal-summary">
                <div>
                  <span className="reveal-kicker">{baseLabel}</span>
                  <h2>
                    {lastResult?.rank === 1
                      ? "You found the room."
                      : lastResult?.rank === 0
                        ? "The room went somewhere else."
                        : "That answer has a crowd."}
                  </h2>
                  <p>
                    {lastResult?.rank === 0
                      ? "No answer this round. The next obvious one is waiting."
                      : `${lastResult?.answer || "—"} scored ${lastResult?.points ?? 0} points.`}
                    {config.mode === "crowd" && lastResult?.crowdJoined
                      ? ` ${lastResult.crowdJoined} ${lastResult.crowdJoined === 1 ? "person" : "people"} joined you.`
                      : ""}
                  </p>
                </div>
                <div className="points-burst">
                  <strong>+{lastResult?.points ?? 0}</strong>
                  <span>{config.mode === "crowd" ? "points" : "lift"}</span>
                </div>
              </div>

              <div className="answer-board">
                <span className="board-title">THE TOP FIVE</span>
                {question.answers.slice(0, 5).map((answer, index) => {
                  const picked =
                    lastResult?.answer &&
                    answer.toLowerCase() === lastResult.answer.toLowerCase() &&
                    lastResult.rank === index + 1;
                  return (
                    <div className={`board-row ${picked ? "is-picked" : ""}`} key={answer}>
                      <span className="board-rank">{index + 1}</span>
                      <strong>{answer}</strong>
                      <em>
                        {config.mode === "crowd"
                          ? [100, 75, 75, 50, 50][index]
                          : [100, 64, 64, 64, 32][index]}{" "}
                        pts
                      </em>
                      {picked && <Check size={16} />}
                    </div>
                  );
                })}
              </div>

              <button className="next-button" onClick={next}>
                {roundIndex + 1 >= roundLimit ||
                (config.variant === "endless" && balloons <= 0) ? (
                  <>
                    See my results
                    <ChevronRight size={19} />
                  </>
                ) : (
                  <>
                    Next prompt
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
