# Noillirk Games

A fan-made, two-mode instinct game built for `noillirk.games`.

## Modes

- **Crowd 100** — 10 prompts, 30 seconds each, five answer bands, late-round multipliers, and a 100-person crowd pulling toward your tile.
- **Sky Climb** — 7 prompts, 15 seconds each, six score tiers, three balloons in Endless mode, and 10 metres of altitude per point.
- **Live Room** — the same two rule sets played with friends through Cloudflare Durable Objects.
- **Theme challenges** — three original, fixed Sky Climb boards (21 prompts): Comfort Kitchen, Into the Wild, and Small Everyday Things.

## Daily challenges, records, and sharing

The daily date is fixed when a run starts, even if it finishes after midnight.
The first completed daily run records the score and streak; replays use the same
questions and are marked as practice. Previous dates shared by friends are also
practice. A new daily board is available at local midnight.

My records keeps the last 30 completed solo runs and separate theme bests on the
current browser. Storage failures are reported on the results screen. Existing
mode bests are preserved. Records do not sync across devices.

Result cards contain score tiles without answers. Copy/native sharing includes
the same challenge's date, theme, or seed. The X share link adds
`utm_source=x.com&utm_medium=social&utm_campaign=result_share&utm_content=scorecard`.
Copy/native links do not invent a publishing source. Share buttons open the
platform's composer; the game does not automatically post results.

After building, run `npm run test:p1` and `npm run test:p2` for the targeted
SEO, game, retention, and sharing checks.

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

`npm run build` also prerenders the homepage, `/how-to-play/`, `/rules/`,
`/modes/crowd-100/`, and `/modes/sky-climb/` into static HTML with page-specific
metadata and a generated sitemap. The same React components supply the static
content and the interactive browser view. JavaScript is required to play, but
the guides and homepage content are readable in the initial HTML.

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
