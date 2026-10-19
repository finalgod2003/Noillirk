import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
try {
  const game = await server.ssrLoadModule("/src/lib/game.ts");
  const { questions } = await server.ssrLoadModule("/src/data/questions.ts");
  const { contentPages } = await server.ssrLoadModule("/src/data/pages.ts");
  const dog = questions.find((question) => question.id === "dog-breed");
  assert.equal(game.findRank(dog, "l"), 0, "Single letters must not match substrings");
  assert.equal(game.findRank(dog, "retriever"), 0, "Ambiguous fragments must not select a breed");
  assert.equal(game.findRank(dog, "Lab"), 1, "Listed aliases should work");
  assert.equal(game.findRank(dog, "  LÁBRADOR!  "), 1, "Normalize accents, case and punctuation");
  assert.equal(game.findRank(dog, "Labradors"), 1, "Accept simple plurals");
  assert.equal(game.findRank(dog, "Labrador Retriever"), 1);
  assert.equal(game.findRank(dog, "Labrador and Poodle"), 0, "Do not accept a list of guesses");
  assert.equal(game.findRank(dog, "Labradorx"), 1, "Allow an unambiguous single-character typo");
  assert.equal(game.findRank({ answers: ["Apple", "Apply"] }, "Applx"), 0, "Reject ambiguous typos");
  assert.equal(game.findRank({ answers: ["Apple"], extraAccepted: ["Apply"] }, "Apply"), 13, "Exact extra answer beats fuzzy board answer");
  for (const question of questions) {
    question.answers.forEach((answer, index) => assert.equal(game.findRank(question, answer), index + 1, `${question.id}: ${answer}`));
  }
  for (const mode of ["crowd", "climb"]) {
    for (const input of ["", "!!!", "not a known breed"]) {
      assert.equal(game.scoreRound(mode, dog, input, 9).points, 0, `${mode}: invalid answers cannot earn points`);
    }
  }
  const aliasResult = game.scoreRound("crowd", dog, "Lab", 9);
  assert.equal(aliasResult.points, 400);
  assert.equal(aliasResult.matchedAnswer, "Labrador");
  assert.equal(aliasResult.answer, "Lab", "Preserve submitted answer in review");
  assert.equal(game.scoreRound("climb", dog, "Labrador", 0).points, 100);
  assert.equal(game.formatAltitude(7000), "7.0 km", "Altitude is already in metres");
  assert.equal(game.formatAltitude(640), "640 m");
  assert.match(game.buildShareText({ mode: "climb", altitude: 7000, rounds: 7 }), /7\.0 km/);

  const { SummaryScreen } = await server.ssrLoadModule("/src/components/SummaryScreen.tsx");
  const matched = game.scoreRound("climb", dog, "Lab", 0);
  const missed = game.scoreRound("climb", dog, "zzzzzz", 1);
  const summaryHtml = renderToStaticMarkup(createElement(SummaryScreen, {
    summary: { mode: "climb", variant: "classic", score: 100, altitude: 1000, crowd: 4, perfects: 1, offBoard: 2, rounds: 3, title: "Close Call" },
    results: [matched, missed, { ...missed, answer: "—", outcome: "timeout" }],
    config: { mode: "climb", variant: "classic" }, onReplay() {}, onHome() {}, onOtherMode() {}
  }));
  assert.match(summaryHtml, /1\.0 km/, "Summary displays metres without multiplying again");
  assert.doesNotMatch(summaryHtml, /10\.0 km/);
  assert.match(summaryHtml, /Matched: Labrador/);
  assert.match(summaryHtml, /Top answer: Labrador/);
  assert.match(summaryHtml, /Not in the answer list/);
  assert.match(summaryHtml, /Time ran out/);

  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  for (const path of ["/", ...contentPages.map((page) => page.path)]) {
    const html = await readFile(`dist${path}index.html`, "utf8");
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${path}: one H1 in initial HTML`);
    assert.match(html, /<main[\s>]/, `${path}: initial HTML contains the main content`);
    assert.ok(html.includes(`rel="canonical" href="https://noillirk.games${path}"`));
    assert.ok(sitemap.includes(`https://noillirk.games${path}</loc>`));
    assert.doesNotMatch(html, /style="[^"]*opacity:0(?:;|")/, `${path}: content must not start invisible`);
    for (const page of contentPages.filter((page) => page.path !== path)) {
      assert.ok(html.includes(`href="${page.path}"`), `${path}: crawlable link to ${page.path}`);
    }
    if (path !== "/") {
      const page = contentPages.find((page) => page.path === path);
      assert.ok(html.includes(page.heading));
      assert.ok(html.includes(page.description));
      assert.ok(html.includes(`<title>${page.title.replace(/&/g, "&amp;")}</title>`));
      assert.doesNotMatch(html, /"@type":\s*"FAQPage"/, "Do not reuse homepage FAQ schema on guides");
    }
  }
  console.log("P1 checks passed: answer matching/scoring, altitude, and five crawlable static pages.");
} finally {
  await server.close();
}
