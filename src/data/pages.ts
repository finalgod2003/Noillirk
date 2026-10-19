export interface ContentPageData {
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; links?: { label: string; href: string }[] }[];
  mode: "crowd" | "climb";
}

export const contentPages: ContentPageData[] = [
  {
    path: "/daily/",
    title: "Noillirk Daily – Play Today's Crowd 100 Challenge",
    description: "Play the Noillirk daily challenge: 10 prompts, 30 seconds per answer, and one recorded daily score. Learn reset times, streaks, replays, and sharing.",
    heading: "Noillirk daily challenge",
    intro: "Make a daily habit of guessing popular answers. This fan-made edition's daily challenge is a 10-prompt Crowd 100 run, with a date-based question sequence and 30 seconds to submit each answer. Select Play Crowd 100 to start today's challenge.",
    mode: "crowd",
    sections: [
      { heading: "What changes each day?", paragraphs: ["The game selects a question sequence from its curated bank using the date on your device. Starting the same date again uses the same sequence in this edition. The bank is finite, so individual prompts can return on other days; this is not a promise of ten newly written questions every day.", "Today's challenge changes at local midnight. A run already in progress keeps the date it started with, even if you finish after midnight. Players in different time zones may be playing different dates."] },
      { heading: "Your first completed run counts", paragraphs: ["Finish all ten prompts to record your daily score. Your first eligible completed run for the date counts toward your daily record and streak. Completing consecutive dates extends the streak; replaying a completed date is practice and does not replace its recorded score.", "A perfect run earns 2,600 points. The crowd reaches its visual target of 100 people at 2,500 points, while the score can keep increasing. Passes and timeouts earn zero but still let you complete the challenge."], links: [{ label: "See the scoring rules", href: "/game-rules/" }] },
      { heading: "Replay, review, and share", paragraphs: ["After the run, review your answers alongside the top answer for each prompt. Play again to practice the same date. Sharing your result produces colored tiles without answer text and a link to the same challenge, so friends can compare scores without seeing your answers first.", "An older date opened through a shared link is practice. For a longer session after today's challenge, choose Unlimited on the homepage: each run contains 20 prompts."], links: [{ label: "Try a 20-prompt Unlimited run", href: "/?play=crowd&variant=unlimited" }] },
      { heading: "Where are my daily results saved?", paragraphs: ["My records on the homepage shows your recent runs. Records are stored in this browser on this device, without an account or cross-device synchronization. Clearing site data or switching browsers can remove or separate your history. Browser storage must be available for saving to work.", "This is an independent fan-made challenge. Its prompts, rankings, scores, and daily sequence are not the original Noillirk's daily board."] }
    ]
  },
  {
    path: "/tips/",
    title: "Noillirk Tips – Better Guesses, Timing & Score Strategy",
    description: "Improve your Noillirk guesses with practical tips for common answers, clean submissions, Crowd 100 multipliers, and Sky Climb's short timer.",
    heading: "Noillirk tips for better guesses",
    intro: "A strong Noillirk answer fits the prompt and lands high on this edition's curated answer list. These tips help you make clearer choices under the timer; they cannot guarantee a top-ranked answer.",
    mode: "crowd",
    sections: [
      { heading: "1. Read the category before choosing", paragraphs: ["Identify what kind of answer the prompt requests: an object, place, activity, or something else. For a fruit prompt, a familiar fruit is a more useful starting point than a meal containing fruit. Avoid spending the whole timer searching for an unusual answer: this game rewards higher-ranked familiar responses.", "Popularity here is an editorial estimate, not a live poll. An answer that seems obvious to you may be ranked differently or missing from the list."] },
      { heading: "2. Submit one clear answer", paragraphs: ["Type the answer itself. For a hypothetical fruit prompt, enter apple rather than apple, banana, or orange. A list is evaluated as one submission; it does not give you several chances.", "Capitalization and extra spaces are normalized, and selected aliases and small spelling variations are accepted. Still, use a complete, correctly spelled word when you can. The matcher does not understand every synonym or explanatory sentence."] },
      { heading: "3. Leave time to press Submit", paragraphs: ["Crowd 100 allows 30 seconds per prompt; Sky Climb allows 15. Choose a plausible answer early enough to type and submit before the deadline. An empty submission does not stop the clock, and switching tabs does not extend it.", "There is no extra speed bonus in the scoring rules. Use the available time to check that your answer fits, then submit. Passing and timing out both score zero."], links: [{ label: "Read all game rules", href: "/game-rules/" }] },
      { heading: "4. Stay focused in the final Crowd 100 rounds", paragraphs: ["Rounds 9 and 10 multiply base points by four. A rank #1 answer is worth 400 points there, compared with 100 in the opening rounds. A weak start does not prevent a useful recovery in the later rounds.", "There is no resource to save for those rounds: you still get one answer per prompt. Give every question your best guess and use the reveal breaks to reset your attention."] },
      { heading: "5. Learn from the reveal, then practice", paragraphs: ["The timer pauses while the answer board is visible. Compare your response with the top five and notice whether your guess was too specific, outside the category, or simply absent from the curated list. A zero does not prove that your answer is factually wrong.", "Replay the daily challenge to practice without changing the day's recorded result. Use Unlimited for a longer session. In Sky Climb Endless, a recognized answer avoids losing a balloon, while a rank #1 answer restores all three."], links: [{ label: "Play the daily challenge", href: "/daily/" }, { label: "Explore Sky Climb", href: "/modes/sky-climb/" }] }
    ]
  },
  {
    path: "/games-like-noillirk/",
    title: "Games Like Noillirk – Category & Word Game Alternatives",
    description: "Compare Noillirk with Connections and Categories online. Find word games for category discovery, unique answers, or a faster Noillirk mode.",
    heading: "Games like Noillirk",
    intro: "If you enjoy Noillirk's word prompts, the next game to try depends on what you enjoy most: finding categories, thinking of words quickly, or comparing answers with friends. These alternatives share parts of that experience but use different goals and scoring.",
    mode: "crowd",
    sections: [
      { heading: "Connections: discover the hidden categories", paragraphs: ["The New York Times' Connections presents 16 words. You find four groups of four words that share a theme. It suits players who enjoy recognizing links between words and reconsidering an answer that could fit more than one category.", "In Noillirk you generate an answer to a given prompt; in Connections you organize words already on the board. Choose it when you want category deduction instead of guessing which response ranks highest."], links: [{ label: "Play Connections", href: "https://www.nytimes.com/games/connections" }, { label: "Connections rules from The New York Times", href: "https://thenewyorktimeshelpcenter.helpjuice.com/360011158491-New-York-Times-Games/28525912587924-Connections" }] },
      { heading: "Categories online: find a unique word for each category", paragraphs: ["Categories at scattergoriesonline.net asks you to fill categories with words beginning with a chosen letter. Its published online rules award points for unique answers and no points when another player gives the same word. Rooms support playing with friends.", "This changes the strategy: Noillirk rewards high-ranked common answers, while Categories encourages you to find valid words that other players are less likely to choose. Try it if you enjoy typing your own responses and comparing them with a group."], links: [{ label: "Play Categories online", href: "https://scattergoriesonline.net/" }, { label: "Read Categories online rules", href: "https://scattergoriesonline.net/rules.xhtml" }] },
      { heading: "Sky Climb: a faster mode on this site", paragraphs: ["If you want the same answer-guessing mechanic with a different pace, Sky Climb is another mode of this fan-made Noillirk edition. Classic has seven prompts, 15 seconds per answer, and an altitude score. It is not a separate external game.", "Endless adds three balloons and a maximum of 30 prompts. A pass, timeout, or unrecognized answer costs a balloon; a top-ranked answer refills them. Choose this mode if shorter decisions and a survival element appeal to you."], links: [{ label: "Explore Sky Climb Classic and Endless", href: "/modes/sky-climb/" }] },
      { heading: "Which should you try first?", paragraphs: ["Choose Connections for finding hidden relationships among supplied words. Choose Categories online for creating unique answers under a letter constraint with other players. Stay with Noillirk daily if you want a short, repeatable routine centered on common answers.", "The external games are operated by their respective publishers. This comparison does not imply a partnership or shared account, score, or daily puzzle."], links: [{ label: "Return to Noillirk daily", href: "/daily/" }] }
    ]
  },
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
    path: "/game-rules/",
    title: "Noillirk Game Rules – Scoring, Timers & Answer Matching",
    description: "Understand Noillirk scoring rules, Crowd 100 multipliers, Sky Climb ranks, time limits, and what happens when an answer is not recognized.",
    heading: "Noillirk game rules and scoring",
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
  const normalized = `${path.replace(/\/+$/, "")}/`;
  return contentPages.find((page) => page.path === (normalized === "/rules/" ? "/game-rules/" : normalized));
}
