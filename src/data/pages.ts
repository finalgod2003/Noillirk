export interface ContentPageData {
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  mode: "crowd" | "climb";
}

export const contentPages: ContentPageData[] = [
  {
    path: "/how-to-play/",
    title: "How to Play Noillirk – Beginner's Guide",
    description: "Learn how to play Noillirk: choose a mode, guess a popular answer, submit before time runs out, and review your score.",
    heading: "How to play Noillirk",
    intro: "Noillirk is a free browser word game about guessing what most people would say. This independent fan-made edition uses curated answer lists, so popularity ranks are editorial estimates rather than live survey results.",
    mode: "crowd",
    sections: [
      { heading: "1. Start with Crowd 100", paragraphs: ["Select Play Now to go straight to the first prompt. There is no account, download, or setup form. A standard Crowd 100 run has 10 prompts with 30 seconds for each answer. If you prefer a faster round, Sky Climb gives you 7 prompts with 15 seconds each."] },
      { heading: "2. Give one common answer", paragraphs: ["Read the category and prompt, then type one answer into the answer box. For a prompt such as naming a fruit, think of a familiar fruit instead of an unusual one. Submit the answer alone, rather than a sentence or several guesses separated by commas.", "Capitalization, extra spaces, punctuation, and accents are normalized. The game also accepts simple singular/plural variants, selected aliases, and an unambiguous one-character typo in longer answers. It does not understand every synonym or partial word."] },
      { heading: "3. Submit before the timer ends", paragraphs: ["Press Enter or select Submit. An empty or punctuation-only answer shows a prompt to enter text; the clock continues running. Select Pass to skip a question for zero points. If the timer expires before you submit, that round also scores zero."] },
      { heading: "4. Review the board and continue", paragraphs: ["After each submission, the board shows the top five answers and your points. A recognized alias or spelling variant highlights its matching answer. An answer missing from the curated list scores zero, but that does not necessarily mean it is factually wrong.", "Select Next prompt when you are ready. At the end, See my results shows your total, each submitted answer, the top answer, and the scoring breakdown. You can play again or try the other mode."] }
    ]
  },
  {
    path: "/rules/",
    title: "Noillirk Rules – Scoring, Timers & Answer Matching",
    description: "Understand Noillirk scoring rules, Crowd 100 multipliers, Sky Climb ranks, time limits, and what happens when an answer is not recognized.",
    heading: "Noillirk rules and scoring",
    intro: "Each prompt accepts one submitted answer. Higher-ranked answers earn more points. These rules describe this fan-made edition of Noillirk; other versions may use different answer lists or scoring.",
    mode: "crowd",
    sections: [
      { heading: "Crowd 100 points", paragraphs: ["Rank #1 earns 100 base points. Ranks #2–3 earn 75, #4–5 earn 50, and #6–10 earn 25. Other recognized answers earn 10. Unrecognized answers, passes, and timeouts earn zero.", "Rounds 1–2 use ×1, rounds 3–5 use ×2, rounds 6–8 use ×3, and rounds 9–10 use ×4. For example, a rank #4 answer in round 3 earns 50 × 2 = 100 points. Every 25 total points adds one person to your crowd, capped at 100 people. Unlimited has 20 prompts; rounds 11–20 use ×1."] },
      { heading: "Sky Climb points and altitude", paragraphs: ["Rank #1 earns 100 points, #2–4 earn 64, #5–9 earn 32, #10 earns 16, and #11 earns 8. Other recognized answers earn 4. A pass, timeout, or unrecognized answer earns zero.", "Every point adds 10 metres. A rank #2 answer earns 640 m. Seven rank #1 answers produce 700 points, or 7,000 m. There are no round multipliers in Sky Climb."] },
      { heading: "Timers and Endless balloons", paragraphs: ["Crowd 100 gives you 30 seconds per prompt; Sky Climb gives you 15 seconds. The timer stops for the answer reveal. A submission after the deadline counts as a timeout, even if the browser was in the background.", "Endless starts with three balloons and lasts up to 30 rounds. A pass, timeout, or unrecognized answer costs one balloon. A rank #1 answer restores your balloons to three. The run ends after round 30 or when you have no balloons left."] },
      { heading: "Matching and result labels", paragraphs: ["Exact answers and listed aliases take priority. The game tolerates simple article and plural variants and some small spelling errors, but it does not award points just because a letter or fragment appears inside an answer.", "The results page preserves what you typed and shows the recognized board answer where available. The Off board metric counts ranks outside the top ten as well as zero-point rounds. Curated answer lists can omit valid answers; use the revealed board to learn what this edition recognizes."] }
    ]
  },
  {
    path: "/modes/crowd-100/",
    title: "Noillirk Crowd 100 – How to Play & Score Points",
    description: "Play Noillirk Crowd 100 free. Learn the 10-prompt daily mode, 30-second timer, score multipliers, and 20-prompt Unlimited option.",
    heading: "Noillirk Crowd 100",
    intro: "Crowd 100 turns popular answers into a crowd on your tile. Your goal is to collect 2,500 points and pull all 100 people toward you. Play Now starts the standard 10-prompt run immediately.",
    mode: "crowd",
    sections: [
      { heading: "Ten prompts, 30 seconds each", paragraphs: ["The standard daily variant selects 10 prompts using your device's local date. Your first completed run saves that day's score and advances your streak. Replaying the same date uses the same sequence in practice mode, without changing your daily record. The date stays fixed if a run finishes after midnight; the next day's board becomes available at local midnight.", "Each prompt has a category and one answer box. Think of a common response, type it, and press Enter. The timer pauses for the answer reveal, so you can read the top five before starting the next prompt. My records keeps the last 30 completed runs in this browser. Shared result tiles do not reveal answers, and their link opens the same challenge."] },
      { heading: "Later rounds are worth more", paragraphs: ["The best-ranked answer earns 100 base points, followed by 75 for ranks #2–3, 50 for #4–5, and 25 for #6–10. Other recognized answers earn 10; missing or unrecognized answers earn zero.", "Multipliers rise from ×1 in rounds 1–2 to ×2 in rounds 3–5, ×3 in rounds 6–8, and ×4 in rounds 9–10. A perfect ten-round run earns 2,600 points. The crowd display stops at 100 people, but your score still records all points."] },
      { heading: "Try Unlimited for a longer run", paragraphs: ["The Unlimited button on the homepage starts a 20-prompt run. Despite the name, each run has a fixed end after 20 prompts. The first ten rounds use the standard multipliers, and rounds 11–20 return to ×1. You can start another run from the results page."] },
      { heading: "A simple approach", paragraphs: ["Prefer a familiar answer that fits the prompt. Submit one specific answer instead of a list. If your answer is not recognized, read the revealed board; its rankings come from the game's curated list, not current player votes.", "Use the final results to compare your answer with the top answer for each question. For shorter timers and an altitude-based score, try Sky Climb."] }
    ]
  },
  {
    path: "/modes/sky-climb/",
    title: "Noillirk Sky Climb – Classic & Endless Mode Guide",
    description: "Learn Noillirk Sky Climb: seven prompts, 15-second rounds, a 7,000-metre perfect run, and Endless mode with three balloons.",
    heading: "Noillirk Sky Climb",
    intro: "Sky Climb converts the popularity rank of your answer into altitude. Classic mode has seven prompts with 15 seconds each. A perfect run reaches 7,000 metres, and you can start playing free in your browser.",
    mode: "climb",
    sections: [
      { heading: "Classic: seven quick decisions", paragraphs: ["Read each prompt, choose a common answer, and submit it before the 15-second timer expires. The reveal screen shows your points and the top five answers. Take as long as you need to review the board; the next timer begins when you move to the next prompt.", "There are no later-round multipliers. A strong answer in the first round is worth the same as the same rank in the seventh. After all seven prompts, your results show your total altitude and a question-by-question review."] },
      { heading: "How points become metres", paragraphs: ["A rank #1 answer earns 100 points, or 1,000 m. Ranks #2–4 earn 640 m, #5–9 earn 320 m, #10 earns 160 m, and #11 earns 80 m. Other recognized answers earn 40 m. Unrecognized answers, passes, and timeouts add no altitude.", "For example, one rank #1 answer and one rank #2 answer total 164 points and 1,640 m. The summary may display altitude in kilometres; 7,000 m is 7.0 km."] },
      { heading: "Endless: three balloons, up to 30 rounds", paragraphs: ["Choose Endless on the homepage for a longer run. You begin with three balloons. Skipping, running out of time, or submitting an unrecognized answer uses one balloon. Finding a rank #1 answer refills your supply to three.", "The run finishes when your balloons reach zero or after 30 prompts. Other recognized answers still add altitude without costing a balloon. Classic mode always plays seven prompts and does not end early because of balloons."] },
      { heading: "Choose a mode that fits your pace", paragraphs: ["Sky Climb's short timer rewards a quick first response. If you want more thinking time, Crowd 100 gives you 30 seconds per prompt and uses a crowd target instead of altitude. Both modes use curated answer lists and need no account or download."] }
    ]
  }
];

export function findContentPage(path: string) {
  return contentPages.find((page) => page.path === `${path.replace(/\/+$/, "")}/`);
}
