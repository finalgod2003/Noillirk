import { pickQuestions, scoreRound } from "../src/lib/game";
import type { GameMode, Question, RoomSnapshot, RoundResult } from "../src/types";

interface Env {
  ROOMS: DurableObjectNamespace;
  ASSETS: Fetcher;
}

type PlayerState = {
  id: string;
  name: string;
  score: number;
  submitted: boolean;
};

type RoomState = {
  code: string;
  status: "lobby" | "playing" | "reveal" | "finished";
  mode: GameMode;
  rounds: number;
  seconds: number;
  round: number;
  hostId: string;
  players: PlayerState[];
  bank: Question[];
  answers: Record<string, RoundResult>;
  createdAt: number;
  endsAt?: number;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });

const textError = (message: string, status = 400) =>
  new Response(message, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

function roomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  for (let index = 0; index < bytes.length; index += 1) {
    code += alphabet[bytes[index] % alphabet.length];
  }
  return code;
}

function snapshot(room: RoomState): RoomSnapshot {
  const question = room.bank[room.round];
  const rows = room.players.map((player) => {
    const result = room.answers[player.id];
    return {
      playerId: player.id,
      name: player.name,
      answer: result?.answer ?? "—",
      rank: result?.rank ?? 0,
      points: result?.points ?? 0
    };
  });

  return {
    code: room.code,
    status: room.status,
    mode: room.mode,
    variant: "room",
    rounds: room.rounds,
    seconds: room.seconds,
    round: room.round,
    hostId: room.hostId,
    players: room.players,
    prompt: room.status === "playing" || room.status === "reveal" ? question?.prompt : undefined,
    category: room.status === "playing" || room.status === "reveal" ? question?.category : undefined,
    endsAt: room.endsAt,
    reveal:
      room.status === "reveal" || room.status === "finished"
        ? {
            rows,
            topAnswers: question?.answers.slice(0, 5) ?? []
          }
        : undefined,
    createdAt: room.createdAt
  };
}

export class GameRoom {
  private state: DurableObjectState;
  private room: RoomState | null = null;

  constructor(state: DurableObjectState, _env: Env) {
    this.state = state;
    void this.state.blockConcurrencyWhile(async () => {
      this.room = (await this.state.storage.get<RoomState>("room")) ?? null;
    });
  }

  private async persist() {
    if (this.room) await this.state.storage.put("room", this.room);
  }

  private revealIfNeeded() {
    if (!this.room || this.room.status !== "playing" || !this.room.endsAt) return;
    if (Date.now() < this.room.endsAt) return;
    this.room.status = "reveal";
  }

  private revealNow() {
    if (!this.room) return;
    for (const player of this.room.players) {
      player.submitted = false;
    }
    this.room.status = "reveal";
  }

  async fetch(request: Request): Promise<Response> {
    if (!this.room) this.room = (await this.state.storage.get<RoomState>("room")) ?? null;
    const url = new URL(request.url);
    const action = url.pathname.split("/").filter(Boolean).at(-1);

    if (request.method === "POST" && action === "create") {
      const body = (await request.json()) as {
        code: string;
        playerId: string;
        name: string;
        mode: GameMode;
        rounds: number;
        seconds: number;
      };
      this.room = {
        code: body.code,
        status: "lobby",
        mode: body.mode,
        rounds: body.mode === "crowd" ? 10 : 7,
        seconds: body.mode === "crowd" ? 30 : 15,
        round: 0,
        hostId: body.playerId,
        players: [{ id: body.playerId, name: body.name, score: 0, submitted: false }],
        bank: pickQuestions(body.mode === "crowd" ? 10 : 7, `${body.code}-${Date.now()}`),
        answers: {},
        createdAt: Date.now()
      };
      await this.persist();
      return json({ playerId: body.playerId });
    }

    if (!this.room) return textError("Room not found", 404);

    if (request.method === "POST" && action === "join") {
      if (this.room.status !== "lobby") return textError("This room has already started", 409);
      const body = (await request.json()) as { name: string; playerId: string };
      if (this.room.players.length >= 12) return textError("This room is full", 409);
      this.room.players.push({
        id: body.playerId,
        name: body.name,
        score: 0,
        submitted: false
      });
      await this.persist();
      return json({ playerId: body.playerId });
    }

    if (action === "state") {
      this.revealIfNeeded();
      await this.persist();
      return json(snapshot(this.room));
    }

    if (request.method === "POST" && action === "start") {
      const body = (await request.json()) as { playerId: string };
      if (body.playerId !== this.room.hostId) return textError("Only the host can start", 403);
      this.room.status = "playing";
      this.room.round = 0;
      this.room.answers = {};
      this.room.players.forEach((player) => {
        player.score = 0;
        player.submitted = false;
      });
      this.room.endsAt = Date.now() + this.room.seconds * 1000;
      await this.persist();
      return json(snapshot(this.room));
    }

    if (request.method === "POST" && action === "answer") {
      const body = (await request.json()) as { playerId: string; text: string };
      if (this.room.status !== "playing") return textError("This round is closed", 409);
      if (this.room.endsAt && Date.now() >= this.room.endsAt) {
        this.revealNow();
        await this.persist();
        return json(snapshot(this.room));
      }
      const player = this.room.players.find((entry) => entry.id === body.playerId);
      if (!player) return textError("Player not found", 404);
      if (player.submitted) return json(snapshot(this.room));
      if (!body.text.trim()) return textError("Answer cannot be empty", 400);

      const question = this.room.bank[this.room.round];
      const result = scoreRound(this.room.mode, question, body.text, this.room.round);
      this.room.answers[player.id] = result;
      player.submitted = true;
      player.score += result.points;
      if (this.room.players.every((entry) => entry.submitted)) this.revealNow();
      await this.persist();
      return json(snapshot(this.room));
    }

    if (request.method === "POST" && action === "next") {
      const body = (await request.json()) as { playerId: string };
      if (body.playerId !== this.room.hostId) return textError("Only the host can continue", 403);
      if (this.room.status !== "reveal") return textError("The current round is not revealed", 409);
      if (this.room.round + 1 >= this.room.rounds) {
        this.room.status = "finished";
        this.room.endsAt = undefined;
      } else {
        this.room.round += 1;
        this.room.status = "playing";
        this.room.answers = {};
        this.room.players.forEach((player) => {
          player.submitted = false;
        });
        this.room.endsAt = Date.now() + this.room.seconds * 1000;
      }
      await this.persist();
      return json(snapshot(this.room));
    }

    return textError("Unknown room action", 404);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "noillirk-games", now: new Date().toISOString() });
    }

    if (url.pathname === "/api/rooms" && request.method === "POST") {
      const body = (await request.json()) as {
        name?: string;
        mode?: GameMode;
      };
      if (!body.name?.trim()) return textError("Name is required", 400);
      const code = roomCode();
      const playerId = crypto.randomUUID();
      const room = env.ROOMS.get(env.ROOMS.idFromName(code));
      const response = await room.fetch(
        new Request(`https://room/${code}/create`, {
          method: "POST",
          body: JSON.stringify({
            code,
            playerId,
            name: body.name.trim().slice(0, 18),
            mode: body.mode === "climb" ? "climb" : "crowd",
            rounds: body.mode === "climb" ? 7 : 10,
            seconds: body.mode === "climb" ? 15 : 30
          }),
          headers: { "content-type": "application/json" }
        })
      );
      if (!response.ok) return response;
      return json({ code, playerId });
    }

    const roomMatch = url.pathname.match(/^\/api\/rooms\/([A-Z0-9]{5})\/(join|state|start|answer|next)$/);
    if (roomMatch) {
      const [, code, action] = roomMatch;
      const playerId = crypto.randomUUID();
      const room = env.ROOMS.get(env.ROOMS.idFromName(code));
      if (action === "state") {
        return room.fetch(new Request(`https://room/${code}/state${url.search}`));
      }
      if (action === "join") {
        const body = (await request.json()) as { name?: string };
        if (!body.name?.trim()) return textError("Name is required", 400);
        return room.fetch(
          new Request(`https://room/${code}/join`, {
            method: "POST",
            body: JSON.stringify({ name: body.name.trim().slice(0, 18), playerId }),
            headers: { "content-type": "application/json" }
          })
        );
      }
      return room.fetch(
        new Request(`https://room/${code}/${action}`, {
          method: "POST",
          body: await request.text(),
          headers: { "content-type": "application/json" }
        })
      );
    }

    if (url.pathname.startsWith("/api/")) return textError("Not found", 404);
    return env.ASSETS.fetch(request);
  }
};
