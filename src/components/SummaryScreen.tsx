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
import { formatAltitude } from "../lib/game";
import { challengeLabel, challengeUrl, resultShareText } from "../lib/retention";

export function SummaryScreen({
  summary,
  results,
  config,
  onReplay,
  onHome,
  onOtherMode,
  onRecords,
  saved = true
}: {
  summary: GameSummary;
  results: RoundResult[];
  config: GameConfig;
  onReplay: () => void;
  onHome: () => void;
  onOtherMode: () => void;
  onRecords?: () => void;
  saved?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const shareText = resultShareText(config, summary, results);
  const origin = typeof window === "undefined" ? "https://noillirk.games" : window.location.origin;
  const shareUrl = challengeUrl(config, origin);
  const fullShareText = `${shareText}\n${shareUrl}`;
  const xShare = `https://twitter.com/intent/tweet?${new URLSearchParams({ text: shareText, url: challengeUrl(config, origin, "x.com") })}`;

  const copyResult = async () => {
    setShareError("");
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setShareError("Copying is unavailable. Open Copy manually below and select the result text.");
    }
  };

  const share = async () => {
    setShareError("");
    const payload = {
      title: "Noillirk Games",
      text: shareText,
      url: shareUrl
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await copyResult();
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        setShareError("Sharing is unavailable. Use Copy result or Copy manually below.");
      }
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
          <p className="game-challenge-label">{challengeLabel(config)}</p>
          <h1>
            {summary.mode === "crowd"
              ? `${summary.crowd}`
              : formatAltitude(summary.altitude)}
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
              <p className="share-result-text">{shareText}</p>
            </div>
            <button onClick={share} className="share-card-button">
              {copied ? <Check size={17} /> : <Share2 size={17} />}
              {copied ? "Copied" : "Share result"}
            </button>
          </div>

          <div className="share-tools">
            <button className="text-button" onClick={copyResult}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy result"}</button>
            <a className="text-button" href={xShare} target="_blank" rel="noopener noreferrer">Share on X<ArrowRight size={16} /></a>
            <span>🟩 #1 · 🟨 Top 5 · 🟧 Accepted · ⬛ Missed</span>
            <details><summary>Copy manually</summary><textarea aria-label="Result text and challenge link" readOnly value={fullShareText} onFocus={(event) => event.currentTarget.select()} /></details>
          </div>
          <p className="save-status" role="status">{saved ? config.variant === "daily" ? config.practice ? "Practice run saved. Your first daily score and streak stay unchanged." : "Daily score saved. Come back after local midnight for a new board." : "Run saved to My records on this browser." : "This browser could not save your run. Copy your result to keep it."}</p>

          {shareError && <p className="answer-error" role="alert">{shareError}</p>}

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
                  <small className="result-detail">
                    {result.outcome === "timeout" ? "Time ran out" : result.outcome === "passed" ? "Passed" : result.rank === 0 ? "Not in the answer list" : result.matchedAnswer ? `Matched: ${result.matchedAnswer} · Rank #${result.rank}` : "Accepted outside the top 12"}
                    {` · Top answer: ${result.topAnswers[0] ?? "—"}`}
                    {result.points > 0 ? ` · ${result.base} × ${result.multiplier} = ${result.points} pts` : " · 0 pts"}
                  </small>
                </div>
                <em>{result.points > 0 ? `+${result.points}` : "—"}</em>
              </div>
            ))}
          </div>

          <div className="summary-actions">
            <button className="primary-button" onClick={onReplay}>
              <Copy size={17} />
              {config.variant === "daily" ? "Replay daily · practice" : "Replay this board"}
            </button>
            <button className="mode-secondary" onClick={onOtherMode}>
              {summary.mode === "crowd" ? "Try the climb" : "Try the table"}
              <ArrowRight size={16} />
            </button>
            {onRecords && <button className="mode-secondary" onClick={onRecords}>My records<ArrowRight size={16} /></button>}
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
