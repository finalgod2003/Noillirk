# Noillirk Games

A fan-made, two-mode instinct game built for `noillirk.games`.

## Modes

- **Crowd 100** — 10 prompts, 30 seconds each, five answer bands, late-round multipliers, and a 100-person crowd pulling toward your tile.
- **Sky Climb** — 7 prompts, 15 seconds each, six score tiers, three balloons in Endless mode, and 10 metres of altitude per point.
- **Live Room** — the same two rule sets played with friends through Cloudflare Durable Objects.

## Local development

```powershell
npm install
npm run dev
```

For the full Worker + Durable Object runtime:

```powershell
npm run build
npx wrangler dev --port 8791
```

## Deploy

```powershell
npx wrangler login
npm run deploy
```

Then add `noillirk.games` and `www.noillirk.games` as custom domains in Cloudflare Workers & Pages. Namecheap DNS should use Cloudflare nameservers.

## Structure

- `src/` — React app, question bank, scoring, game UI, room client.
- `worker/` — Cloudflare Worker and Durable Object room service.
- `wrangler.jsonc` — static assets + room binding.

The game is independent and fan-made. It is not affiliated with Daily or the original Noillirk. All visuals, prompts, and answer boards in this repository are original to this project.
