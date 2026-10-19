import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Share2,
  Sparkles,
  Users,
  Wind
} from "lucide-react";
import type { GameConfig, GameSummary, RoundResult } from "../types";
import { buildShareText, formatAltitude } from "../lib/game";

export function SummaryScreen({
  summary,
  results,
  config,
  onReplay,
  onHome,
  onOtherMode
}: {
  summary: GameSummary;
  results: RoundResult[];
  config: GameConfig;
  onReplay: () => void;
  onHome: () => void;
  onOtherMode: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = buildShareText({
    mode: summary.mode,
    score: summary.score,
    crowd: summary.crowd,
    altitude: summary.altitude,
    rounds: summary.rounds
  });

  const share = async () => {
    const payload = {
      title: "Noillirk Games",
      text: shareText,
      url: window.location.origin
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      // A dismissed native share sheet is not an error state.
    }
  };

  return (
    <div className={`summary-page summary-${summary.mode}`}>
      <header className="summary-header">
        <button className="play-brand" onClick={onHome}>
          <ArrowLeft size={17} />
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <strong>NOILLIRK</strong>
        </button>
        <span className="summary-mode-chip">
          {summary.mode === "crowd" ? <Users size={14} /> : <Wind size={14} />}
          {summary.mode === "crowd" ? "CROWD 100" : "SKY CLIMB"}
        </span>
      </header>

      <main className="summary-main">
        <motion.section
          className="summary-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="summary-kicker">
            <Sparkles size={15} />
            RUN COMPLETE
          </div>
          <span className="summary-title">{summary.title}</span>
          <h1>
            {summary.mode === "crowd"
              ? `${summary.crowd}`
              : formatAltitude(summary.altitude).replace(" km", "").replace(" m", "")}
            <small>{summary.mode === "crowd" ? "/ 100 people" : "altitude"}</small>
          </h1>
          <p>
            {summary.mode === "crowd"
              ? `You pulled ${summary.crowd} of 100 people across ${summary.rounds} prompts.`
              : `You scored ${summary.score} points and climbed ${formatAltitude(summary.altitude)}.`}
          </p>
        </motion.section>

        <motion.section
          className="summary-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <div className="summary-metrics">
            <div>
              <span>SCORE</span>
              <strong>{summary.score.toLocaleString()}</strong>
            </div>
            <div>
              <span>#1 ANSWERS</span>
              <strong>{summary.perfects}</strong>
            </div>
            <div>
              <span>OFF BOARD</span>
              <strong>{summary.offBoard}</strong>
            </div>
            <div>
              <span>{summary.mode === "crowd" ? "CROWD" : "ALTITUDE"}</span>
              <strong>
                {summary.mode === "crowd" ? `${summary.crowd}/100` : formatAltitude(summary.altitude)}
              </strong>
            </div>
          </div>

          <div className="summary-share-card">
            <div className="share-card-stamp">
              <span>NOILLIRK</span>
              <strong>{summary.title.toUpperCase()}</strong>
            </div>
            <div>
              <span className="share-card-label">MY RUN</span>
              <p>{shareText}</p>
            </div>
            <button onClick={share} className="share-card-button">
              {copied ? <Check size={17} /> : <Share2 size={17} />}
              {copied ? "Copied" : "Share result"}
            </button>
          </div>

          <div className="summary-answers">
            <div className="summary-answers-head">
              <span>THE RECEIPTS</span>
              <span>{summary.rounds} rounds</span>
            </div>
            {results.map((result, index) => (
              <div className="summary-answer-row" key={`${result.questionId}-${index}`}>
                <span className="summary-answer-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <span>{result.prompt}</span>
                  <strong>{result.answer}</strong>
                </div>
                <em>{result.points > 0 ? `+${result.points}` : "—"}</em>
              </div>
            ))}
          </div>

          <div className="summary-actions">
            <button className="primary-button" onClick={onReplay}>
              <Copy size={17} />
              Play again
            </button>
            <button className="mode-secondary" onClick={onOtherMode}>
              {summary.mode === "crowd" ? "Try the climb" : "Try the table"}
              <ArrowRight size={16} />
            </button>
          </div>

          <p className="summary-disclaimer">
            Independent fan-made game. No affiliation with Daily or the original Noillirk.
            Answer boards are editorial estimates.
          </p>
        </motion.section>

        <button className="summary-home-link" onClick={onHome}>
          <ArrowLeft size={15} />
          Back to the signal room
        </button>
      </main>
    </div>
  );
}
