import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Radio,
  Sparkles,
  Users,
  Wind
} from "lucide-react";
import type { GameConfig } from "../types";
import { loadRecord } from "../lib/game";
import { currentStreak } from "../lib/retention";
import { Challenges } from "./Challenges";

function ModeStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="mode-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function CrowdDial() {
  return (
    <div className="hero-dial" aria-hidden="true">
      <div className="hero-dial-ring ring-a" />
      <div className="hero-dial-ring ring-b" />
      <div className="hero-dial-ring ring-c" />
      {Array.from({ length: 48 }, (_, index) => {
        const angle = (index / 48) * Math.PI * 2;
        const radius = 36 + (index % 4) * 5;
        return (
          <span
            className={`hero-dial-dot tone-${index % 5}`}
            key={index}
            style={{
              left: `${50 + Math.cos(angle) * radius}%`,
              top: `${50 + Math.sin(angle) * radius}%`,
              animationDelay: `${(index % 12) * 80}ms`
            }}
          />
        );
      })}
      <div className="hero-dial-center">
        <span>YOU</span>
        <strong>100</strong>
        <em>possible instincts</em>
      </div>
      <span className="hero-dial-note note-a">say the obvious</span>
      <span className="hero-dial-note note-b">move the room</span>
    </div>
  );
}

export function Home({
  onStart,
  onOpenRoom,
  onRecords = () => {}
}: {
  onStart: (config: GameConfig) => void;
  onOpenRoom: () => void;
  onRecords?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const crowdRecord = loadRecord("crowd", "daily");
  const climbRecord = loadRecord("climb", "classic");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="home-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Noillirk Games home">
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-word">NOILLIRK</span>
          <span className="brand-suffix">.GAMES</span>
        </a>
        <div className="header-live">
          <span className="header-live-dot" />
          <span>Live arena</span>
          <strong>NOI / 01</strong>
        </div>
        <nav className="header-nav" aria-label="Primary navigation">
          <button
            className="nav-play"
            onClick={() => onStart({ mode: "crowd", variant: "daily" })}
          >
            Play Now
          </button>
          <a href="/how-to-play/">Guide</a>
          <a href="#challenges">Challenges</a>
          <a href="/game-rules/">Rules</a>
          <button className="nav-room" onClick={onOpenRoom}>
            <Radio size={14} />
            Room
          </button>
        </nav>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="eyebrow-signal" />
              Free browser game · Fan-made edition
            </motion.div>
            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
            >
              <span className="hero-brandline">Noillirk</span>{" "}
              <span className="hero-word">Guess What Most People Would Say.</span>
            </motion.h1>
            <motion.p
              className="hero-lede"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
            >
              Guess the most popular answer. Play Crowd 100 free online: 10 prompts,
              30 seconds each. No sign-up or download.
            </motion.p>
            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => onStart({ mode: "crowd", variant: "daily" })}
              >
                Play Now
                <ArrowRight size={18} />
              </button>
              <button
                className="text-button"
                onClick={() => onStart({ mode: "climb", variant: "classic" })}
              >
                Try Sky Climb · 7 prompts
                <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="hero-meta">
              <span>No sign-up</span>
              <span>3–5 min</span>
              <span>Desktop + mobile browser</span>
            </div>
          </div>
          <motion.div
            className="hero-visual"
            initial={false}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="broadcast-frame">
              <div className="broadcast-bar">
                <span className="broadcast-live">
                  <i />
                  On air
                </span>
                <span>Instinct cam / 01</span>
                <span className="broadcast-time">00:30</span>
              </div>
              <CrowdDial />
              <div className="broadcast-lower-third">
                <div>
                  <span>The room right now</span>
                  <strong>
                    100 <small>instincts</small>
                  </strong>
                </div>
                <span className="broadcast-tag">Crowd 100</span>
              </div>
            </div>
            <div className="hero-floating-card">
              <span>Mode 01</span>
              <strong>10 rounds</strong>
            </div>
          </motion.div>
        </section>

        <div className="broadcast-ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>Think fast</span>
            <span>Crowd 100</span>
            <span>Sky Climb</span>
            <span>No sign-up</span>
            <span>Same room energy</span>
            <span>Trust the obvious</span>
            <span>Think fast</span>
            <span>Crowd 100</span>
            <span>Sky Climb</span>
            <span>No sign-up</span>
            <span>Same room energy</span>
            <span>Trust the obvious</span>
          </div>
        </div>

        <Challenges onStart={onStart} onRecords={onRecords} />

        <section className="mode-section" id="play">
          <div className="section-heading">
            <div>
              <span className="section-number">01</span>
              <p>Crowd 100 or Sky Climb</p>
            </div>
            <h2>Play Noillirk: two game modes.</h2>
          </div>

          <div className="mode-grid">
            <motion.article
              className="mode-card mode-crowd"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
            >
              <span className="mode-card-ghost" aria-hidden="true">
                100
              </span>
              <div className="mode-card-top">
                <span className="mode-icon">
                  <Users size={22} />
                </span>
                <span className="mode-tag">THE TABLE</span>
                <span className="mode-index">A / 01</span>
              </div>
              <div className="mode-copy">
                <h3><a href="/modes/crowd-100/">Crowd 100</a></h3>
                <p>
                  Type the answer you think most people would give across 10 prompts with 30
                  seconds each. Every 25 points pulls one person toward your tile; rounds 3–5 double,
                  6–8 triple, and 9–10 quadruple your points.
                </p>
              </div>
              <div className="mode-stats">
                <ModeStat value="10" label="prompts" />
                <ModeStat value="30s" label="per round" />
                <ModeStat value="100" label="people" />
              </div>
              <div className="mode-actions">
                <button
                  className="mode-play"
                  onClick={() => onStart({ mode: "crowd", variant: "daily" })}
                >
                  Play Crowd 100
                  <ArrowRight size={18} />
                </button>
                <button
                  className="mode-secondary"
                  onClick={() => onStart({ mode: "crowd", variant: "unlimited" })}
                >
                  Unlimited · 20 prompts
                </button>
              </div>
              <span className="record-line">
                {crowdRecord.best ? `Your best: ${crowdRecord.best.toLocaleString()} pts` : "No table record yet"}
                {currentStreak(crowdRecord) > 0 ? ` · ${currentStreak(crowdRecord)} day streak` : ""}
              </span>
            </motion.article>

            <motion.article
              className="mode-card mode-climb"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <span className="mode-card-ghost" aria-hidden="true">
                7K
              </span>
              <div className="mode-card-top">
                <span className="mode-icon">
                  <Wind size={22} />
                </span>
                <span className="mode-tag">THE CLIMB</span>
                <span className="mode-index">B / 02</span>
              </div>
              <div className="mode-copy">
                <h3><a href="/modes/sky-climb/">Sky Climb</a></h3>
                <p>
                  Rank an answer in six tiers across 7 prompts with 15 seconds each. One point
                  equals 10 metres, up to 100 points per prompt. Endless mode gives you three
                  balloons and a 30-round run.
                </p>
              </div>
              <div className="mode-stats">
                <ModeStat value="7" label="prompts" />
                <ModeStat value="15s" label="per round" />
                <ModeStat value="7k" label="metres" />
              </div>
              <div className="mode-actions">
                <button
                  className="mode-play"
                  onClick={() => onStart({ mode: "climb", variant: "classic" })}
                >
                  Play Sky Climb
                  <ArrowUpRight size={18} />
                </button>
                <button
                  className="mode-secondary"
                  onClick={() => onStart({ mode: "climb", variant: "endless" })}
                >
                  Endless · 3 balloons · 30 rounds
                </button>
              </div>
              <span className="record-line">
                {climbRecord.best
                  ? `Your best: ${(climbRecord.best * 10).toLocaleString()} m`
                  : "No climb record yet"}
              </span>
            </motion.article>
          </div>

          <motion.div
            className="room-banner"
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="room-pulse">
              <span />
              <span />
              <span />
            </div>
            <div className="room-banner-copy">
              <span className="room-kicker">PRIVATE LIVE ROOMS</span>
              <h3>Play Noillirk with friends.</h3>
              <p>
                Create a room, share a 5-character code, and play the same prompts on the same
                clock with up to 12 people.
              </p>
            </div>
            <button className="room-button" onClick={onOpenRoom}>
              Create or join
              <Radio size={17} />
            </button>
          </motion.div>
        </section>

        <section className="guide-section" id="guide">
          <div className="section-heading">
            <div>
              <span className="section-number">02</span>
              <p>Direct answers, not lore</p>
            </div>
            <h2>What is Noillirk?</h2>
          </div>

          <div className="answer-panel">
            <div className="answer-copy">
              <span className="answer-label">THE QUICK ANSWER</span>
              <p className="answer-definition">
                <strong>Noillirk</strong> is a free browser word game where you guess the answer
                most people would give. This fan-made edition has two solo modes and private live
                rooms. A run takes about 3–5 minutes, and no account or download is required.
              </p>
              <div className="answer-actions">
                <button
                  className="primary-button"
                  onClick={() => onStart({ mode: "crowd", variant: "daily" })}
                >
                  Play Noillirk free
                  <ArrowRight size={18} />
                </button>
                <a className="guide-secondary" href="#play">
                  Compare the two modes
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="quick-facts" aria-label="Noillirk quick facts">
              <div>
                <span>PRICE</span>
                <strong>Free</strong>
                <small>No account required</small>
              </div>
              <div>
                <span>ONE RUN</span>
                <strong>3–5 min</strong>
                <small>10 or 7 prompts</small>
              </div>
              <div>
                <span>LIVE ROOMS</span>
                <strong>Up to 12</strong>
                <small>5-character code</small>
              </div>
              <div>
                <span>PLATFORM</span>
                <strong>Browser</strong>
                <small>Desktop and mobile</small>
              </div>
            </div>
          </div>

          <div className="guide-grid">
            <article className="guide-card">
              <span className="guide-kicker">HOW TO PLAY</span>
              <h3>Three steps to one obvious answer.</h3>
              <ol className="play-steps">
                <li>
                  <span>01</span>
                  <div>
                    <strong>Pick Crowd 100 or Sky Climb.</strong>
                    <p>
                      Crowd 100 uses 10 prompts at 30 seconds each. Sky Climb uses 7 prompts at
                      15 seconds each.
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Type the answer most people would give.</strong>
                    <p>
                      Choose the answer already in the room, not the most creative or unusual
                      response.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Submit before the clock reaches zero.</strong>
                    <p>
                      Your answer rank becomes crowd members in Crowd 100 or metres of altitude
                      in Sky Climb.
                    </p>
                  </div>
                </li>
              </ol>
            </article>

            <article className="guide-card compare-card">
              <span className="guide-kicker">MODE COMPARISON</span>
              <h3>Crowd 100 vs Sky Climb.</h3>
              <div className="mode-compare-wrap">
                <table className="mode-compare">
                  <thead>
                    <tr>
                      <th scope="col">Rule</th>
                      <th scope="col">Crowd 100</th>
                      <th scope="col">Sky Climb</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Prompts</th>
                      <td>10</td>
                      <td>7 · 30 in Endless</td>
                    </tr>
                    <tr>
                      <th scope="row">Timer</th>
                      <td>30 sec</td>
                      <td>15 sec</td>
                    </tr>
                    <tr>
                      <th scope="row">Goal</th>
                      <td>Pull 100 people</td>
                      <td>Climb 7,000 m</td>
                    </tr>
                    <tr>
                      <th scope="row">Base score</th>
                      <td>100 / 75 / 50 / 25 / 10</td>
                      <td>100 / 64 / 32 / 16 / 8 / 4</td>
                    </tr>
                    <tr>
                      <th scope="row">Twist</th>
                      <td>Later rounds ×2–×4</td>
                      <td>Endless: 3 balloons</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <div className="faq-panel">
            <div className="faq-heading">
              <span className="guide-kicker">NOILLIRK FAQ</span>
              <h3>Questions, answered directly.</h3>
            </div>
            <div className="faq-grid">
              <article className="faq-item">
                <h4>Is Noillirk free?</h4>
                <p>
                  Yes. Both solo modes and private live rooms are free. No account, app, or
                  download is required.
                </p>
              </article>
              <article className="faq-item">
                <h4>How long is one Noillirk game?</h4>
                <p>
                  A solo run takes about 3–5 minutes. Crowd 100 runs 10 prompts at 30 seconds
                  each; Sky Climb runs 7 prompts at 15 seconds each, plus answer reveals.
                </p>
              </article>
              <article className="faq-item">
                <h4>Can I play Noillirk with friends?</h4>
                <p>
                  Yes. Create a private room, share the 5-character room code, and play with up
                  to 12 people on the same prompts and timer.
                </p>
              </article>
              <article className="faq-item">
                <h4>What is the best Noillirk strategy?</h4>
                <p>
                  Give the most common answer, not the cleverest one. Think like a large, fast
                  group and submit before the clock reaches zero.
                </p>
              </article>
              <article className="faq-item">
                <h4>Is this the official Noillirk?</h4>
                <p>
                  No. This is an independent fan-made edition. It is not affiliated with Daily or
                  the original Noillirk at playdaily.org/noillirk.
                </p>
              </article>
              <article className="faq-item">
                <h4>Is Noillirk like Krillion?</h4>
                <p>
                  It is a reverse take on the idea. Krillion rewards rare answers; Noillirk asks
                  for the answer most people would give. This site is a standalone fan version.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="rules-section" id="rules">
          <div className="section-heading rules-heading">
            <div>
              <span className="section-number">03</span>
              <p>Ranks, multipliers, and altitude</p>
            </div>
            <h2>How Noillirk scoring works.</h2>
          </div>
          <div className="rules-grid">
            <div className="rule-card">
              <div className="rule-card-head">
                <Users size={20} />
                <span>CROWD 100</span>
              </div>
              <div className="score-stack">
                <span><strong>100</strong>#1 answer</span>
                <span><strong>75</strong>runner-up</span>
                <span><strong>50</strong>top five</span>
                <span><strong>25</strong>top ten</span>
                <span><strong>10</strong>other accepted</span>
                <span><strong>0</strong>unrecognized / pass / timeout</span>
              </div>
              <p>
                Questions 3–5 double. 6–8 triple. 9–10 quadruple. Every 25 points pulls one
                person, so 2,500 points fills the room.
              </p>
            </div>
            <div className="rule-card">
              <div className="rule-card-head">
                <Wind size={20} />
                <span>SKY CLIMB</span>
              </div>
              <div className="score-stack">
                <span><strong>100</strong>sky high</span>
                <span><strong>64</strong>jet stream</span>
                <span><strong>32</strong>cloud nine</span>
                <span><strong>16</strong>kite</span>
                <span><strong>8 / 4</strong>treetop / grounded</span>
                <span><strong>0</strong>unrecognized / pass / timeout</span>
              </div>
              <p>
                One point is 10 metres. A perfect seven-round climb peaking at 100 points per
                prompt ends at 7,000 metres.
              </p>
            </div>
            <div className="rule-card rule-note">
              <div className="rule-card-head">
                <Sparkles size={20} />
                <span>ONE RULE</span>
              </div>
              <blockquote>“Don’t hunt for the clever answer. Hunt for the one already in the room.”</blockquote>
              <p>
                Answers are editorial estimates, not live player counts. This is an independent
                fan-made game, not affiliated with Daily or the original Noillirk at
                playdaily.org/noillirk.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-mark">N</span>
          <p>A fan-made Noillirk browser game.</p>
        </div>
        <div className="footer-links">
          <a href="#play">Play</a>
          <a href="/how-to-play/">How to play</a>
          <a href="/daily/">Daily challenge</a>
          <a href="/tips/">Tips</a>
          <a href="/games-like-noillirk/">Games like Noillirk</a>
          <a href="/game-rules/">Rules</a>
          <a href="/modes/crowd-100/">Crowd 100</a>
          <a href="/modes/sky-climb/">Sky Climb</a>
          <button onClick={onRecords}>My records</button>
          <a href="https://playdaily.org/noillirk" target="_blank" rel="noreferrer">
            Original game
          </a>
          <button onClick={copyLink}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Share site"}
          </button>
        </div>
      </footer>
    </div>
  );
}
