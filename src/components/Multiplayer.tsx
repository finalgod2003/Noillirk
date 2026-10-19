import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Crown,
  LoaderCircle,
  Radio,
  RefreshCw,
  Users
} from "lucide-react";
import type { GameMode, RoomSnapshot } from "../types";

async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export function Multiplayer({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem("noillirk-games:name") ?? "";
    } catch {
      return "";
    }
  });
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<GameMode>("crowd");
  const [room, setRoom] = useState<RoomSnapshot | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState("");
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  const code = room?.code ?? "";
  const me = room?.players.find((player) => player.id === playerId);
  const isHost = room?.hostId === playerId;
  const secondsLeft = room?.endsAt ? Math.max(0, Math.ceil((room.endsAt - now) / 1000)) : 0;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 300);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!code || !playerId) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const next = await api<RoomSnapshot>(
          `/api/rooms/${code}/state?playerId=${encodeURIComponent(playerId)}`
        );
        if (!cancelled) setRoom(next);
      } catch (pollError) {
        if (!cancelled) setError(pollError instanceof Error ? pollError.message : "Room disconnected");
      }
    };
    void poll();
    const timer = window.setInterval(poll, 850);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [code, playerId]);

  const persistName = (value: string) => {
    setName(value);
    try {
      localStorage.setItem("noillirk-games:name", value);
    } catch {
      // Name persistence is optional.
    }
  };

  const createRoom = async () => {
    if (!name.trim()) {
      setError("Add a name first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await api<{ code: string; playerId: string }>("/api/rooms", {
        name: name.trim(),
        mode,
        rounds: mode === "crowd" ? 10 : 7,
        seconds: mode === "crowd" ? 30 : 15
      });
      setPlayerId(result.playerId);
      setRoom(await api<RoomSnapshot>(`/api/rooms/${result.code}/state?playerId=${result.playerId}`));
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not create room.");
    } finally {
      setBusy(false);
    }
  };

  const joinRoom = async () => {
    if (!name.trim() || !joinCode.trim()) {
      setError("Add your name and a room code.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await api<{ playerId: string }>(
        `/api/rooms/${joinCode.trim().toUpperCase()}/join`,
        { name: name.trim() }
      );
      setPlayerId(result.playerId);
      setRoom(
        await api<RoomSnapshot>(
          `/api/rooms/${joinCode.trim().toUpperCase()}/state?playerId=${result.playerId}`
        )
      );
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : "Could not join room.");
    } finally {
      setBusy(false);
    }
  };

  const start = async () => {
    if (!room || !isHost) return;
    setBusy(true);
    setError("");
    try {
      setRoom(await api<RoomSnapshot>(`/api/rooms/${room.code}/start`, { playerId }));
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Could not start room.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!room || !answer.trim()) return;
    setBusy(true);
    setError("");
    try {
      const next = await api<RoomSnapshot>(`/api/rooms/${room.code}/answer`, {
        playerId,
        text: answer.trim()
      });
      setRoom(next);
      setAnswer("");
    } catch (answerError) {
      setError(answerError instanceof Error ? answerError.message : "Could not submit answer.");
    } finally {
      setBusy(false);
    }
  };

  const nextRound = async () => {
    if (!room || !isHost) return;
    setBusy(true);
    setError("");
    try {
      setRoom(await api<RoomSnapshot>(`/api/rooms/${room.code}/next`, { playerId }));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not advance room.");
    } finally {
      setBusy(false);
    }
  };

  const copyCode = async () => {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const sortedPlayers = useMemo(
    () => [...(room?.players ?? [])].sort((a, b) => b.score - a.score),
    [room?.players]
  );

  return (
    <div className="room-page">
      <header className="summary-header">
        <button className="play-brand" onClick={onBack}>
          <ArrowLeft size={17} />
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <strong>NOILLIRK</strong>
        </button>
        <span className="summary-mode-chip">
          <Radio size={14} /> LIVE ROOM
        </span>
      </header>

      {!room ? (
        <main className="room-entry">
          <motion.div
            className="room-entry-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="summary-kicker">
              <Users size={15} /> SAME CLOCK. SAME PROMPTS.
            </span>
            <h1>Bring the room with you.</h1>
            <p>
              Host a private room on Cloudflare, send the code, and reveal everyone's instincts
              together.
            </p>
          </motion.div>

          <motion.div
            className="room-entry-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <label className="field-label">
              YOUR NAME
              <input
                value={name}
                onChange={(event) => persistName(event.target.value)}
                placeholder="Swift Otter"
                maxLength={18}
              />
            </label>

            <div className="room-mode-picker">
              <button
                className={mode === "crowd" ? "is-active" : ""}
                onClick={() => setMode("crowd")}
              >
                <Users size={17} />
                Crowd 100
                <span>10 × 30s</span>
              </button>
              <button
                className={mode === "climb" ? "is-active" : ""}
                onClick={() => setMode("climb")}
              >
                <ArrowRight size={17} />
                Sky Climb
                <span>7 × 15s</span>
              </button>
            </div>

            <button className="primary-button room-create" onClick={createRoom} disabled={busy}>
              {busy ? <LoaderCircle className="spin" size={18} /> : <Radio size={18} />}
              Create a room
            </button>

            <div className="room-divider"><span>OR JOIN WITH A CODE</span></div>

            <div className="join-row">
              <input
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                maxLength={6}
              />
              <button onClick={joinRoom} disabled={busy}>
                Join
                <ArrowRight size={17} />
              </button>
            </div>
            {error && <p className="form-error">{error}</p>}
          </motion.div>
        </main>
      ) : (
        <main className="room-main">
          <section className="room-topline">
            <div>
              <span>{room.mode === "crowd" ? "CROWD 100" : "SKY CLIMB"}</span>
              <h1>Room {room.code}</h1>
            </div>
            <button className="room-code-button" onClick={copyCode}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy code"}
            </button>
          </section>

          {room.status === "lobby" && (
            <section className="room-lobby">
              <div className="room-lobby-head">
                <div>
                  <span className="summary-kicker">
                    <Radio size={14} /> WAITING FOR PLAYERS
                  </span>
                  <h2>Send the code. Keep the clock cold.</h2>
                </div>
                <span className="player-count">{room.players.length} joined</span>
              </div>

              <div className="player-grid">
                {room.players.map((player, index) => (
                  <div className="player-chip" key={player.id}>
                    <span className={`player-avatar avatar-${index % 4}`}>
                      {player.name.slice(0, 1).toUpperCase()}
                    </span>
                    <strong>{player.name}</strong>
                    {player.id === room.hostId && <Crown size={15} />}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - room.players.length) }, (_, index) => (
                  <div className="player-chip is-empty" key={`empty-${index}`}>
                    <span className="player-avatar">?</span>
                    <strong>Waiting…</strong>
                  </div>
                ))}
              </div>

              {isHost ? (
                <button className="primary-button room-start" onClick={start} disabled={busy}>
                  Start the room
                  <ArrowRight size={18} />
                </button>
              ) : (
                <p className="waiting-copy">The host will start when everyone is in.</p>
              )}
            </section>
          )}

          {room.status === "playing" && (
            <section className="room-play">
              <div className="room-round-meta">
                <span>
                  ROUND {String(room.round + 1).padStart(2, "0")} /{" "}
                  {String(room.rounds).padStart(2, "0")}
                </span>
                <span className={secondsLeft <= 5 ? "clock is-urgent" : "clock"}>
                  {secondsLeft}s
                </span>
              </div>
              <h2>{room.prompt}</h2>
              <p className="room-category">{room.category}</p>

              {me?.submitted ? (
                <div className="submitted-state">
                  <Check size={28} />
                  <h3>Answer locked.</h3>
                  <p>Watching the rest of the room commit to something.</p>
                </div>
              ) : (
                <form className="room-answer-form" onSubmit={submit}>
                  <input
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="What would most people say?"
                    maxLength={60}
                    autoFocus
                  />
                  <button type="submit" disabled={!answer.trim() || busy || secondsLeft <= 0}>
                    Lock it in
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}

              <div className="room-player-scores">
                {sortedPlayers.map((player) => (
                  <div key={player.id}>
                    <span>{player.name}</span>
                    <strong>{player.submitted ? "ready" : "thinking"}</strong>
                    <em>{player.score}</em>
                  </div>
                ))}
              </div>
            </section>
          )}

          {room.status === "reveal" && (
            <section className="room-reveal">
              <span className="summary-kicker">
                <RefreshCw size={14} /> ROUND {room.round + 1} REVEAL
              </span>
              <h2>The room has spoken.</h2>
              <div className="room-reveal-grid">
                <div className="room-answer-board">
                  {room.reveal?.topAnswers.map((answerText, index) => (
                    <div key={answerText}>
                      <span>{index + 1}</span>
                      <strong>{answerText}</strong>
                    </div>
                  ))}
                </div>
                <div className="room-reveal-rows">
                  {room.reveal?.rows.map((row) => (
                    <div key={row.playerId}>
                      <span>{row.name}</span>
                      <strong>{row.answer}</strong>
                      <em>+{row.points}</em>
                    </div>
                  ))}
                </div>
              </div>
              {isHost ? (
                <button className="primary-button room-start" onClick={nextRound} disabled={busy}>
                  {room.round + 1 >= room.rounds ? "Show final board" : "Next prompt"}
                  <ArrowRight size={18} />
                </button>
              ) : (
                <p className="waiting-copy">Waiting for the host to move on.</p>
              )}
            </section>
          )}

          {room.status === "finished" && (
            <section className="room-finished">
              <span className="summary-kicker">
                <Crown size={15} /> FINAL BOARD
              </span>
              <h2>{sortedPlayers[0]?.name ?? "The room"} read the room.</h2>
              <div className="final-ranking">
                {sortedPlayers.map((player, index) => (
                  <div key={player.id}>
                    <span>{index + 1}</span>
                    <strong>{player.name}</strong>
                    <em>{player.score} pts</em>
                  </div>
                ))}
              </div>
              <button className="primary-button" onClick={onBack}>
                Back to the signal room
                <ArrowRight size={18} />
              </button>
            </section>
          )}

          {error && <p className="form-error room-error">{error}</p>}
        </main>
      )}
    </div>
  );
}
